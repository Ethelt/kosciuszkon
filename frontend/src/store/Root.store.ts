import { AppStateStore } from "./AppState.store";
import { ChartStateStore } from "./ChartState.store";
import { InfrastructureStateStore } from "./InfrastructureState.store";
import { TasksStateStore } from "./TasksState.store";

export class RootStore {
  AppState: AppStateStore;
  InfrastructureStateStore: InfrastructureStateStore;
  TasksStateStore: TasksStateStore;
  ChartStateStore: ChartStateStore;

  constructor() {
    this.AppState = new AppStateStore(this);
    this.InfrastructureStateStore = new InfrastructureStateStore(this);
    this.TasksStateStore = new TasksStateStore(this);
    this.ChartStateStore = new ChartStateStore(this);
  }
}

export const rootStore = new RootStore();
