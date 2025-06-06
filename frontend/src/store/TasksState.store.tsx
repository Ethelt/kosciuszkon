import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";

import client from "@/api/client";

import { RootStore } from "./Root.store";

export class TasksStateStore {
  rootStore;
  taskList: ITask[] = [];

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  fetchTasks = async () => {
    try {
      const response = await client.get<{ success: boolean; data: ITask[] }>(
        "/tasks",
      );
      this.taskList = response.data.data;
    } catch (error) {
      console.error("Failed to fetch infrastructure data:", error);
    }
  };

  getTaskById = (id: number) => {
    return this.taskList.find(task => task.id === id);
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

  editTask = (data: IFormTask, id: number) => {
    client
      .put<IPostReturnTaskType, IFormTask>(`/tasks/${id}`, data)
      .then(() => {
        toast.success("Task updated successfully!", {
          autoClose: 3000,
        });
      })
      .catch(error => {
        console.error("Failed to send data:", error);
      });
  };

  deleteTask = (id: number) => {
    this.taskList = this.taskList.filter(task => task.id !== id);
    client
      .delete<IPostReturnTaskType>(`/tasks/${id}`)
      .then(() => {
        toast.success("Task deleted successfully!", {
          autoClose: 3000,
        });
      })
      .catch(error => {
        console.error("Failed to delete task:", error);
      });
  };
}
