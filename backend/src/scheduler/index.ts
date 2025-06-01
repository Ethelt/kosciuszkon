import { maxBy } from "lodash";
import { BalanceEstimator } from "../balanceEstimator";
import { DateTime } from "luxon";
import { Task } from "@arabska/shared/src/types";
import { getConfig } from "../config/model";
import { dateToSlotsNumber, getTaskUsage } from "../utils";
import { getAllWaitingTasks } from "../tasks/model";

export class Scheduler {
  constructor(private readonly balanceEstimator: BalanceEstimator) {}

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

    const { start, balances } = this.balanceEstimator.getBalances(
      startDate,
      maxDeadlineDate
    );

    // console.log(startDate.toISO(), maxDeadline, balances.length);
    // balances.forEach((balance, index) => {
    //   console.log(index, balance);
    // });

    prioritySortedTasks.forEach((task) => {
      const startDate = task.range.start;
      const endDate = task.range.end;

      const startIndex = startDate
        ? dateToSlotsNumber(start.toISO()!, startDate)
        : 0;
      const endIndex = endDate
        ? dateToSlotsNumber(start.toISO()!, endDate)
        : balances.length;

      const applicableSpots = balances.slice(startIndex, endIndex);
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
    return queue;
  }

  private async loadTasks(): Promise<Task[]> {
    return await getAllWaitingTasks();
    // return [
    //   {
    //     priority: "low",
    //     range: {
    //       start: "2025-06-01T16:00:00.000Z",
    //       end: "2025-06-01T20:00:00.000Z",
    //     },
    //     action: "test",
    //     id: 1,
    //     name: "Test Task",
    //     description: "Test task description",
    //     status: "waiting",
    //     estimatedWorkingTime: 2500,
    //     estimatedWorkload: 50,
    //     createdAt: new Date().toISOString(),
    //     updatedAt: new Date().toISOString(),
    //   },
    //   {
    //     priority: "critical",
    //     range: {
    //       start: "2025-06-01T12:00:00.000Z",
    //       end: "2025-06-02T00:00:00.000Z",
    //     },
    //     action: "test",
    //     id: 1,
    //     name: "Test Task",
    //     description: "Test task description",
    //     status: "waiting",
    //     estimatedWorkingTime: 100,
    //     estimatedWorkload: 50,
    //     createdAt: new Date().toISOString(),
    //     updatedAt: new Date().toISOString(),
    //   },
    // ];
  }
}

function orderPriority(task1: Task, task2: Task) {
  const priorityOrder = ["critical", "high", "medium", "low"];
  return (
    priorityOrder.indexOf(task1.priority) -
    priorityOrder.indexOf(task2.priority)
  );
}
