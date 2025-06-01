import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";

import client from "@/api/client";

import { RootStore } from "./Root.store";

export class InfrastructureStateStore {
  rootStore;
  formData: IFormSystemConfig = {} as IFormSystemConfig;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setFormData = (data: IFormSystemConfig) => {
    this.formData = data;
    this.sendData(data);
  };

  fetchData = async () => {
    try {
      const response = await client.get<IFormSystemConfig>("/config");
      this.formData = response.data;
      this.formData.coordinates.latitude = Number(
        this.formData.coordinates.latitude,
      );
      this.formData.coordinates.longitude = Number(
        this.formData.coordinates.longitude,
      );
    } catch (error) {
      console.error("Failed to fetch infrastructure data:", error);
    }
  };

  sendData = (data: IFormSystemConfig) => {
    client
      .post<IConfigPostReturnType, IFormSystemConfig>("/config", data)
      .then(response => {
        console.log("Data sent successfully:", response.data);
        toast.success("Data saved successfully!", {
          autoClose: 3000,
        });
      })
      .catch(error => {
        console.error("Failed to send data:", error);
      });
  };
}
