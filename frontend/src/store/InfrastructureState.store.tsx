import { makeAutoObservable } from "mobx";

import client from "@/api/client";

import { RootStore } from "./Root.store";

export class InfrastructureStateStore {
  rootStore;
  formData: IFormSystemConfig = {} as IFormSystemConfig; // Initialize with an empty object

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  // get data for form default values (request to server)
  fetchData = async () => {
    try {
      const response = await client.get<IFormSystemConfig>("/config");
      console.log(response.data);
      this.formData = response.data;
    } catch (error) {
      console.error("Failed to fetch infrastructure data:", error);
    }
  };

  //create method that sets data from form to store and call other one that fetch to server with form data
  sendData = () => {};
}
