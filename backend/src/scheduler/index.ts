import { maxBy } from "lodash";
import { BalanceEstimator } from "../balanceEstimator";
import { DateTime } from "luxon";
import { dateToSlotsNumber, getDateString } from "../utils";
import { Task } from "@arabska/shared/src/types";

class Scheduler {
  constructor(private readonly balanceEstimator: BalanceEstimator) { }

  async scheduleAllTasks(): Promise<Task[]> {
    const tasks = await this.loadTasks();
    if (!tasks.length) return [];

    const prioritySortedTasks = tasks.toSorted((a, b) => orderPriority(a, b));

    const maxDeadline = maxBy(prioritySortedTasks, (t) => t.range.start)?.range
      .end!;

    const startDate = getDateString(DateTime.now());
    const maxDeadlineDate = getDateString(DateTime.fromISO(maxDeadline));

    const { start, balances } = this.balanceEstimator.getBalances(
      startDate,
      maxDeadlineDate
    );

    // balances.forEach((balance, index) => {
    //   console.log(index, balance);
    // });

    prioritySortedTasks.forEach((task) => {
      const startDate = task.range.start;
      const endDate = task.range.end;

      const startIndex = startDate ? dateToSlotsNumber(start, startDate) : 0;
      const endIndex = endDate ? dateToSlotsNumber(start, endDate) : 0;

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
          DateTime.fromISO(start, { zone: "utc" })
            .plus({
              hours: index,
            })
            .toISO() ?? undefined;

        console.log(foundSpot, index, task.plannedExecutionTime);
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

    // console.log(queue);
    return queue;
  }

  private async loadTasks(): Promise<Task[]> {
    return [
      {
        priority: "low",
        range: {
          start: "2025-05-31T16:00:00.000Z",
          end: "2025-06-01T00:00:00.000Z",
        },
        action: "test",
        id: 1,
        name: "Test Task",
        description: "Test task description",
        status: "waiting",
        estimatedWorkingTime: 2500,
        estimatedWorkload: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        priority: "critical",
        range: {
          start: "2025-05-31T12:00:00.000Z",
          end: "2025-06-01T00:00:00.000Z",
        },
        action: "test",
        id: 1,
        name: "Test Task",
        description: "Test task description",
        status: "waiting",
        estimatedWorkingTime: 100,
        estimatedWorkload: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}

const scheduler = new Scheduler(new BalanceEstimator());
scheduler.scheduleAllTasks();

function orderPriority(task1: Task, task2: Task) {
  const priorityOrder = ["critical", "high", "medium", "low"];
  return (
    priorityOrder.indexOf(task1.priority) -
    priorityOrder.indexOf(task2.priority)
  );
}
