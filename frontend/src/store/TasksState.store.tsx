import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";

import client from "@/api/client";

import { RootStore } from "./Root.store";

export class TasksStateStore {
  rootStore;
  taskList: ITask[] = [];
  currentTask: ITask | null = null;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  fetchTasks = async () => {
    try {
      const response = await client.get<{ success: boolean; data: ITask[] }>(
        "/tasks",
      );
      console.log(response.data.data);
      this.taskList = response.data.data;
    } catch (error) {
      console.error("Failed to fetch infrastructure data:", error);
    }
  };

  setCurrentTask = (task: ITask | null) => {
    this.currentTask = task;
  };

  addTask = (data: IFormTask) => {
    client
      .post<IPostReturnTaskType, IFormTask>("/tasks", data)
      .then(() => {
        toast.success("Task added successfully!", {
          autoClose: 3000,
        });
      })
      .catch(error => {
        console.error("Failed to send data:", error);
      });
  };
}
