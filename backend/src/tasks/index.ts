import { Database } from "sqlite3";
import { Express } from 'express';
import { getTask, getTasks, addTask, updateTask, removeTask, TaskToAdd } from "./model";
import { BaseApiErrorResponse, BaseApiSuccessResponse } from "../types";
import { Task } from "@arabska/shared/src/types";

export function addTasksRoutes(app: Express) {
    // Get all tasks
    app.get("/tasks", async (req, res) => {
        try {
            const tasks = await getTasks();
            const response: BaseApiSuccessResponse<Task[]> = {
                success: true,
                data: tasks
            };
            res.json(response);
        } catch (error) {
            const response: BaseApiErrorResponse = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get tasks'
            };
            res.status(500).json(response);
        }
    });

    // Get single task
    app.get("/tasks/:id", async (req, res) => {
        try {
            const task = await getTask(Number(req.params.id));
            const response: BaseApiSuccessResponse<Task> = {
                success: true,
                data: task
            };
            res.json(response);
        } catch (error) {
            const response: BaseApiErrorResponse = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get task'
            };
            res.status(404).json(response);
        }
    });

    // Create new task
    app.post("/tasks", async (req, res) => {
        try {
            const taskData = req.body as TaskToAdd;
            const newTask = await addTask(taskData);
            const response: BaseApiSuccessResponse<Task> = {
                success: true,
                data: newTask
            };
            res.status(201).json(response);
        } catch (error) {
            const response: BaseApiErrorResponse = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create task'
            };
            res.status(500).json(response);
        }
    });

    // Update task
    app.put("/tasks/:id", async (req, res) => {
        try {
            const taskData = req.body as Task;
            if (taskData.id !== Number(req.params.id)) {
                throw new Error('Task ID mismatch');
            }
            const updatedTask = await updateTask(taskData);
            const response: BaseApiSuccessResponse<Task> = {
                success: true,
                data: updatedTask
            };
            res.json(response);
        } catch (error) {
            const response: BaseApiErrorResponse = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update task'
            };
            res.status(500).json(response);
        }
    });

    // Delete task
    app.delete("/tasks/:id", async (req, res) => {
        try {
            await removeTask(Number(req.params.id));
            const response: BaseApiSuccessResponse<void> = {
                success: true,
                data: undefined
            };
            res.json(response);
        } catch (error) {
            const response: BaseApiErrorResponse = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete task'
            };
            res.status(500).json(response);
        }
    });
}

export function createTasksTable(db: Database) {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            action TEXT NOT NULL,
            description TEXT,
            priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
            status TEXT NOT NULL CHECK (status IN ('waiting', 'succeded', 'failed')) DEFAULT 'waiting',
            range_start DATETIME,
            range_end DATETIME,
            estimated_working_time INTEGER,
            estimated_workload INTEGER,
            repeating_frequency TEXT CHECK (repeating_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
            repeating_interval INTEGER,
            repeating_by_week_day TEXT, -- Stored as JSON string
            repeating_by_month_day TEXT, -- Stored as JSON string
            repeating_by_month TEXT, -- Stored as JSON string
            repeating_by_year_day TEXT, -- Stored as JSON string
            repeating_count INTEGER,
            repeating_until DATETIME,
            repeating_start_date DATETIME,
            planned_execution_time DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}
