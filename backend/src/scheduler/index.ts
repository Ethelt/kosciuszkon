import { maxBy } from "lodash";
import { getBalanceEstimator } from "../balanceEstimator";
import { DateTime } from "luxon";
import { Task } from "@arabska/shared/src/types";
import { getConfig } from "../config/model";
import { dateToSlotsNumber, getTaskUsage } from "../utils";
import { getAllWaitingTasks, updateTask } from "../tasks/model";

export class Scheduler {
  constructor() {}

  async scheduleAllTasks(): Promise<Task[]> {
    const tasks = await this.loadTasks();
    if (!tasks.length) {
      console.log("No tasks to schedule");
      return [];
    }

    const config = await getConfig();

    const prioritySortedTasks = tasks.toSorted((a, b) => orderPriority(a, b));

    const maxDeadline =
      maxBy(prioritySortedTasks, (t) => t.range.end)?.range.end ??
      DateTime.now().setZone("utc").endOf("month").toISO()!;

    const startDate = DateTime.now().setZone("utc").startOf("day");
    const maxDeadlineDate = DateTime.fromISO(maxDeadline, {
      zone: "utc",
    });

    const { start, balances } = await (
      await getBalanceEstimator()
    ).getBalances(startDate, maxDeadlineDate);

    // console.log(startDate.toISO(), maxDeadline, balances.length);
    // balances.forEach((balance, index) => {
    //   console.log(index, balance);
    // });

    prioritySortedTasks.forEach((task) => {
      const startDate = task.range.start ?? DateTime.now().toISO();
      const endDate = task.range.end;

      const startIndex = startDate
        ? dateToSlotsNumber(start.toISO()!, startDate)
        : 0;
      const endIndex = endDate
        ? dateToSlotsNumber(start.toISO()!, endDate)
        : balances.length;

      // Ensure we have at least one slot to check
      const applicableSpots = balances.slice(
        startIndex,
        Math.max(startIndex + 1, endIndex)
      );
      // breaks when no spot has enough time
      const foundSpot = maxBy(applicableSpots, (spot) => {
        if (
          task.estimatedWorkingTime &&
          spot.freeDuration < task.estimatedWorkingTime
        ) {
          return -Infinity;
        }
        return spot.balance;
      });

      if (foundSpot) {
        const index = balances.indexOf(foundSpot);
        task.plannedExecutionTime =
          start
            .plus({
              hours: index,
            })
            .toISO() ?? undefined;

        const usage = getTaskUsage(task, config.maxComputingCenterPower ?? 2);

        foundSpot.balance -= usage;
        foundSpot.freeDuration -= task.estimatedWorkingTime ?? 3600;

        // console.log(
        //   "found",
        //   foundSpot,
        //   usage,
        //   task.estimatedWorkingTime ?? 3600
        // );
      } else {
        console.log("No spot found for task", task);
        // Backup: find spot with highest available freeDuration
        const backupSpot = maxBy(applicableSpots, (spot) => spot.freeDuration);

        if (backupSpot) {
          const index = balances.indexOf(backupSpot);
          task.plannedExecutionTime =
            start
              .plus({
                hours: index,
              })
              .toISO() ?? undefined;

          const usage = getTaskUsage(task, config.maxComputingCenterPower ?? 2);

          backupSpot.balance -= usage;
          backupSpot.freeDuration -= task.estimatedWorkingTime ?? 3600;

          console.log("Backup spot found for task", task);
        }
      }
    });

    const queue = prioritySortedTasks.toSorted((a, b) => {
      if (a.plannedExecutionTime && b.plannedExecutionTime) {
        return DateTime.fromISO(a.plannedExecutionTime)
          .diff(DateTime.fromISO(b.plannedExecutionTime))
          .toMillis();
      } else {
        return 0;
      }
    });

    // console.log("queue", queue);
    for (const task of queue) {
      console.log("Saving task", task);
      await updateTask(task);
    }
    return queue;
  }

  private async loadTasks(): Promise<Task[]> {
    return await getAllWaitingTasks();
  }
}

function orderPriority(task1: Task, task2: Task) {
  const priorityOrder = ["critical", "high", "medium", "low"];
  return (
    priorityOrder.indexOf(task1.priority) -
    priorityOrder.indexOf(task2.priority)
  );
}
