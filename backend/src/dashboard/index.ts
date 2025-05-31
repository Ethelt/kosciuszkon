import { ChartTask, DashboardChartData, Task } from '../../../shared/src/types';
import { Express } from 'express';
import { BaseApiErrorResponse, BaseApiSuccessResponse } from '../types';
import { getWaitingTasksInDateRange } from '../tasks/model';
import { getTaskUsage } from '../utils';
import { getConfig } from '../config/model';
import { BalanceEstimator } from '../balanceEstimator';
import { DateTime } from 'luxon';

export function addDashboardRoutes(app: Express) {
    app.get("/dashboard", async (req, res) => {
        try {
            const dateStr = req.query.date as string;
            const date = dateStr ? new Date(dateStr) : new Date();

            const data = await generateDashboardData(date);
            const response: BaseApiSuccessResponse<DashboardChartData> = {
                success: true,
                data
            };
            res.json(response);
        } catch (error) {
            const response: BaseApiErrorResponse = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate dashboard data'
            };
            res.status(500).json(response);
        }
    });
}

async function generateDashboardData(date: Date): Promise<DashboardChartData> {
    // Set time to start of day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    // Set time to end of day
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Get all tasks
    const tasks = await getWaitingTasksInDateRange(startDate, endDate);

    // Filter tasks for the given date
    const dayTasks = tasks.filter(task => {
        if (!task.plannedExecutionTime) return false;
        const taskTime = new Date(task.plannedExecutionTime);
        return taskTime >= startDate && taskTime <= endDate;
    });

    // Generate hours array
    const balancesData = new BalanceEstimator().getBalances(DateTime.fromJSDate(startDate), DateTime.fromJSDate(endDate))
    if (balancesData.balances.length != 24) {
        console.error("generateDashboardData() bad count of estimated balances")
    }
    const hours: DashboardChartData['hours'] = Array.from({ length: 24 }, (_, i) => ({
        balance: balancesData.balances[i].balance,
        label: `${i.toString().padStart(2, '0')}:00`
    }));

    // Map tasks to their respective hours
    const config = await getConfig();
    const tasksWithHours = dayTasks.map(task => {
        const taskTime = new Date(task.plannedExecutionTime!);
        const hourIndex = taskTime.getHours();

        const taskData: ChartTask = {
            id: task.id,
            name: task.name,
            action: task.action,
            plannedExecutionTime: task.plannedExecutionTime!,
            priority: task.priority,
            description: task.description || '',
            estimatedUsage: getTaskUsage(task, config.maxInstallationPower),
            hourIndex
        };

        return taskData;
    });

    return {
        hours,
        tasks: tasksWithHours
    };
}