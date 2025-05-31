import { Task } from "@arabska/shared/src/types";
import { DateTime } from "luxon";

export const formatDate = (date: string): number => {
  return new Date(date).getTime();
};

export type DateString = `${number}-${number}-${number}`;

export function getDateString(date: DateTime): DateString {
  return date.toISO()!.split("T")[0] as DateString;
}

export function dateToSlotsNumber(startDate: string, date: string): number {
  const startDateTime = DateTime.fromISO(startDate);
  const dateTime = DateTime.fromISO(date);
  return Math.floor(dateTime.diff(startDateTime, "hours").hours);
}

export function getTaskUsage(
  task: Task,
  maxComputingCenterPower: number
): number {
  return (
    (maxComputingCenterPower *
      (task.estimatedWorkload ?? 0.5) *
      (task.estimatedWorkingTime ?? 3600)) /
    3600
  );
}
