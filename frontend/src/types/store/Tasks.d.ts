type ITaskPriorities = "low" | "medium" | "high" | "critical";
type ITaskStatuses = "waiting" | "succeeded" | "failed";
type ITaskFrequency = "daily" | "weekly" | "monthly" | "yearly";

type ITaskRepeating = {
  frequency: ITaskFrequency; // daily, weekly, monthly, yearly
  interval?: number; // interval between occurrences
  byWeekDay?: number[]; // 0-6 for Sunday-Saturday
  byMonthDay?: number[]; // 1-31
  byMonth?: number[]; // 1-12
  byYearDay?: number[]; // 1-366
  count?: number; // number of occurrences
  until?: string; // ISO date string
  startDate: string; // ISO date string
};

interface IFormTask {
  name: string;
  action: string; // command to execude
  description?: string;
  priority: ITaskPriorities;
  range: {
    // the scope within which the task is to be performed, specified by user
    start?: string; // ISO date string
    end?: string; // ISO date string
  };
  estimatedWorkingTime?: number; // in seconds
  estimatedWorkload?: number; // in percentage
  repeating?: ITaskRepeating;
  plannedExecutionTime?: string; // ISO date string, when we plan to execute task
}

interface ITask extends IFormTask {
  id: number;
  status: ITaskStatuses;
  createdAt: string;
  updatedAt: string;
}

interface IPostReturnTaskType {
  success: boolean;
  data: ITask;
}

// Dashboard chat types

type IChartHour = {
  balance: number;
  label: string;
};

type IChartTask = Pick<
  ITask,
  "id" | "name" | "action" | "plannedExecutionTime" | "priority" | "description"
> & {
  hourIndex: number;
  estimatedUsage: number;
};

type IDashboardChartData = {
  hours: ChartHour[];
  tasks: ChartITask[];
};
