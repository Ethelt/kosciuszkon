import { makeAutoObservable } from "mobx";

import client from "@/api/client";

import { RootStore } from "./Root.store";

export class ChartStateStore {
  rootStore;
  chartData: IDashboardChartData = {
    hours: [],
    tasks: [],
  }; // Initialize with an empty object

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  getChartData = async () => {
    try {
      const response = await client.get<{ data: IDashboardChartData }>(
        "/chart",
      );
      this.chartData = response.data.data;
      console.log("Chart data fetched successfully:", response.data.data);
    } catch (error) {
      console.error("Failed to fetch infrastructure data:", error);
    }
  };
}
