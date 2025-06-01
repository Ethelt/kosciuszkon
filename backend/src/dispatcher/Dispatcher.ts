import { Task } from "../../../shared/src/types";
import { ThreadManager } from "./ThreadManager";
import {
    getNotEndedTasksWithPlannedExecutionTime,
    updateTask,
} from "../tasks/model";
import { FRAME_TIME_MS } from "../constants";
import { Scheduler } from "../scheduler";
import { formatDate } from "../utils";

export class Dispatcher {
    private lastAnalysisTime: number = 0;
    private threadManager: ThreadManager;

    constructor() {
        this.threadManager = new ThreadManager();
    }

    async onNewTask() {
        await this.threadManager.wake();
        await this.planTasksExecution();
        this.start();
    }

    /**
     * Main dispatcher loop
     */
    async start(): Promise<void> {
        while (true) {
            console.log("Dispatcher started pass...");
            // Check if we need to analyze tasks
            if (Date.now() - this.lastAnalysisTime > FRAME_TIME_MS) {
                await this.planTasksExecution();
            }

            // Get tasks that need to be executed
            const tasks = await getNotEndedTasksWithPlannedExecutionTime();
            const tasksToExecute = tasks.filter((task) => {
                if (!task.plannedExecutionTime) return false;
                const executionTime = formatDate(task.plannedExecutionTime);
                if (Number.isNaN(executionTime)) return true;
                return executionTime - Date.now() <= FRAME_TIME_MS / 2;
            });

            // Execute all tasks that are ready
            if (tasksToExecute.length > 0) {
                for (const task of tasksToExecute) {
                    await this.executeTask(task);
                }
                continue;
            }

            // Find next task to execute
            const nextTask = tasks
                .filter((task) => task.plannedExecutionTime)
                .sort((a, b) => {
                    const timeA = formatDate(a.plannedExecutionTime!);
                    const timeB = formatDate(b.plannedExecutionTime!);
                    return timeA - timeB;
                })[0];

            if (nextTask) {
                const nextExecutionTime = formatDate(nextTask.plannedExecutionTime!);
                const timeUntilNext = nextExecutionTime - this.lastAnalysisTime;

                // Sleep until next task or frame time, whichever is shorter
                const sleepTime = Math.min(timeUntilNext, FRAME_TIME_MS);
                await this.threadManager.sleep(sleepTime);
            } else {
                // No tasks to execute, sleep for frame time
                await this.threadManager.sleep(FRAME_TIME_MS);
            }
        }
    }

    private async planTasksExecution() {
        console.log("Planning tasks execution...");
        const scheduler = new Scheduler();
        await scheduler.scheduleAllTasks();

        this.lastAnalysisTime = Date.now();
    }

    private async executeTask(task: Task): Promise<void> {
        try {
            const { exec } = require("child_process");

            console.log(`Executing task ${task.id}: ${task.action}`);

            await new Promise((resolve, reject) => {
                exec(
                    task.action,
                    (error: Error | null, stdout: string, stderr: string) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve(stdout);
                    }
                );
            });

            // Update task status to succeeded
            await updateTask({
                ...task,
                status: "succeeded",
            });
        } catch (error) {
            console.error(`Error executing task ${task.id}:`, error);

            // Update task status to failed
            await updateTask({
                ...task,
                status: "failed",
            });
        }
    }
}
