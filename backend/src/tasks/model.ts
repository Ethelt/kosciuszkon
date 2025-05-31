import { Task, TaskRepeating } from "../../../shared/src/types";
import { DEFAULT_TASK_STATUS } from "../constants";
import { dbGet, dbGetAll, dbRun } from "../db";

export async function getTask(id: number): Promise<Task> {
    const row = await dbGet<Task>('SELECT * FROM tasks WHERE id = ?', [id]);

    if (!row) {
        throw new Error(`Task with id ${id} not found`);
    }

    return parseTaskFromDb(row);
}

export async function getTasks(): Promise<Task[]> {
    const rows = await dbGetAll<Task[]>('SELECT * FROM tasks ORDER BY created_at DESC') || [];
    return rows.map(parseTaskFromDb);
}

export async function getNotEndedTasksWithPlannedExecutionTime(): Promise<Task[]> {
    const rows = await dbGetAll<Task[]>(`SELECT * FROM tasks 
        WHERE status = 'waiting' AND planned_execution_time IS NOT NULL ORDER BY created_at DESC`
    ) || [];
    return rows.map(parseTaskFromDb);
}

export async function getWaitingTasksInDateRange(startDate: Date, endDate: Date): Promise<Task[]> {
    const rows = await dbGetAll<Task[]>(`SELECT * FROM tasks 
        WHERE status = 'waiting' 
        AND planned_execution_time IS NOT NULL
        AND planned_execution_time BETWEEN ? AND ?
        ORDER BY created_at DESC`,
        [startDate.toISOString(), endDate.toISOString()]
    ) || [];
    return rows.map(parseTaskFromDb);
}

export type TaskToAdd = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>;
export async function addTask(task: TaskToAdd): Promise<Task> {
    const repeatingByWeekDay = task.repeating?.byWeekDay ? JSON.stringify(task.repeating.byWeekDay) : null;
    const repeatingByMonthDay = task.repeating?.byMonthDay ? JSON.stringify(task.repeating.byMonthDay) : null;
    const repeatingByMonth = task.repeating?.byMonth ? JSON.stringify(task.repeating.byMonth) : null;
    const repeatingByYearDay = task.repeating?.byYearDay ? JSON.stringify(task.repeating.byYearDay) : null;

    const result = await dbRun(
        `INSERT INTO tasks (
            name, action, description, priority, 
            range_start, range_end, 
            estimated_working_time, estimated_workload,
            repeating_frequency, repeating_interval,
            repeating_by_week_day, repeating_by_month_day,
            repeating_by_month, repeating_by_year_day,
            repeating_count, repeating_until, repeating_start_date,
            planned_execution_time,
            status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            task.name,
            task.action,
            task.description,
            task.priority,
            task.range.start,
            task.range.end,
            task.estimatedWorkingTime,
            task.estimatedWorkload,
            task.repeating?.frequency,
            task.repeating?.interval,
            repeatingByWeekDay,
            repeatingByMonthDay,
            repeatingByMonth,
            repeatingByYearDay,
            task.repeating?.count,
            task.repeating?.until,
            task.repeating?.startDate,
            task.plannedExecutionTime,
            DEFAULT_TASK_STATUS
        ]
    );

    if (!result.lastID) {
        throw new Error('Failed to insert task');
    }

    return getTask(result.lastID);
}

export async function updateTask(task: Task): Promise<Task> {
    const repeatingByWeekDay = task.repeating?.byWeekDay ? JSON.stringify(task.repeating.byWeekDay) : null;
    const repeatingByMonthDay = task.repeating?.byMonthDay ? JSON.stringify(task.repeating.byMonthDay) : null;
    const repeatingByMonth = task.repeating?.byMonth ? JSON.stringify(task.repeating.byMonth) : null;
    const repeatingByYearDay = task.repeating?.byYearDay ? JSON.stringify(task.repeating.byYearDay) : null;

    await dbRun(
        `UPDATE tasks SET
            name = ?, action = ?, description = ?, priority = ?,
            range_start = ?, range_end = ?,
            estimated_working_time = ?, estimated_workload = ?,
            repeating_frequency = ?, repeating_interval = ?,
            repeating_by_week_day = ?, repeating_by_month_day = ?,
            repeating_by_month = ?, repeating_by_year_day = ?,
            repeating_count = ?, repeating_until = ?, repeating_start_date = ?,
            planned_execution_time = ?,
            updated_at = CURRENT_TIMESTAMP,
            status = ?
        WHERE id = ?`,
        [
            task.name,
            task.action,
            task.description,
            task.priority,
            task.range.start,
            task.range.end,
            task.estimatedWorkingTime,
            task.estimatedWorkload,
            task.repeating?.frequency,
            task.repeating?.interval,
            repeatingByWeekDay,
            repeatingByMonthDay,
            repeatingByMonth,
            repeatingByYearDay,
            task.repeating?.count,
            task.repeating?.until,
            task.repeating?.startDate,
            task.plannedExecutionTime,
            task.status,
            task.id
        ]
    );

    return getTask(task.id);
}

export async function removeTask(id: number): Promise<void> {
    await dbRun('DELETE FROM tasks WHERE id = ?', [id]);
}

function parseTaskFromDb(row: any): Task {
    const repeating: TaskRepeating | undefined = row.repeating_frequency ? {
        frequency: row.repeating_frequency,
        interval: row.repeating_interval,
        byWeekDay: row.repeating_by_week_day ? JSON.parse(row.repeating_by_week_day) : undefined,
        byMonthDay: row.repeating_by_month_day ? JSON.parse(row.repeating_by_month_day) : undefined,
        byMonth: row.repeating_by_month ? JSON.parse(row.repeating_by_month) : undefined,
        byYearDay: row.repeating_by_year_day ? JSON.parse(row.repeating_by_year_day) : undefined,
        count: row.repeating_count,
        until: row.repeating_until,
        startDate: row.repeating_start_date
    } : undefined;

    return {
        id: row.id,
        name: row.name,
        action: row.action,
        description: row.description,
        priority: row.priority,
        range: {
            start: row.range_start,
            end: row.range_end
        },
        estimatedWorkingTime: row.estimated_working_time,
        estimatedWorkload: row.estimated_workload,
        repeating,
        plannedExecutionTime: row.planned_execution_time,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        status: row.status
    };
}
