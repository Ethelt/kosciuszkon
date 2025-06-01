import { Task } from "@arabska/shared/src/types";
import { DateTime } from "luxon";

export const formatDate = (date: string): number => {
    return new Date(date).getTime();
};

export type DateString = `${number}-${number}-${number}`;

// db Format is "2025-06-01 20:00:00"
export function dateISOToDb(date: string | undefined): string | undefined {
    if (!date) return date;
    const dateTime = DateTime.fromISO(date, { "zone": "europe/warsaw" });
    return dateTime.toFormat("yyyy-MM-dd HH:mm:ss");
}
// db Format is "2025-06-01 20:00:00"
export function dateDbToISO(date: string | undefined): string | undefined {
    if (!date) return date;
    return DateTime.fromFormat(date, "yyyy-MM-dd HH:mm:ss", {
        zone: "europe/warsaw",
    }).toISO()!
}

export function dateToSlotsNumber(startDate: string, date: string): number {
    const startDateTime = DateTime.fromISO(startDate, { "zone": "europe/warsaw" });
    const dateTime = DateTime.fromISO(date, { "zone": "europe/warsaw" });
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
