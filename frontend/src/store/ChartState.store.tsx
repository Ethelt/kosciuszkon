import { makeAutoObservable } from "mobx";

import client from "@/api/client";

import { RootStore } from "./Root.store";

export class ChartStateStore {
  rootStore;
  chartData: IDashboardChartData = {
    hours: [],
    tasks: [],
  } as IDashboardChartData; // Initialize with an empty object

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  getChartData = async () => {
    try {
      const response = await client.get<IDashboardChartData>("/chart");
      console.log(response.data);
      this.chartData = response.data;
    } catch (error) {
      console.error("Failed to fetch infrastructure data:", error);
    }
  };
}
