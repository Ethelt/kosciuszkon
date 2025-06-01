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
      const response = await client.get<ITask[]>("/tasks");
      this.taskList = response.data;
    } catch (error) {
      console.error("Failed to fetch infrastructure data:", error);
    }
  };

  // sendData = (data: IFormSystemConfig) => {
  //   client
  //     .post<IConfigPostReturnType, IFormSystemConfig>("/config", data)
  //     .then(response => {
  //       console.log("Data sent successfully:", response.data);
  //       toast.success("Data saved successfully!", {
  //         autoClose: 3000,
  //       });
  //     })
  //     .catch(error => {
  //       console.error("Failed to send data:", error);
  //     });
  // };
}
