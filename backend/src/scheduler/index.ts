import { Task } from "./types";

export class Scheduler {
  tasks: Task[];
  queue: Task[];
  private isInitialized = false;

  constructor() {
    this.tasks = [];
    this.queue = [];
  }

  async init() {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;
    this.tasks = await this.loadTasks();
    this.scheduleAllTasks();
  }

  async addTasks(tasks: Task[]) {
    this.tasks.push(...tasks);
    await this.scheduleAllTasks();
  }

  async scheduleAllTasks(): Promise<Task[]> {
    this.queue = this.tasks.toSorted((a, b) => a.priority - b.priority);
    return this.queue;
  }

  async loadTasks(): Promise<Task[]> {
    return [];
  }
}
