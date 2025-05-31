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
