import { AppStateStore } from "./AppState.store";
import { InfrastructureStateStore } from "./InfrastructureState.store";
import { TasksStateStore } from "./TasksState.store";

export class RootStore {
  AppState: AppStateStore;
  InfrastructureStateStore: InfrastructureStateStore;
  TasksStateStore: TasksStateStore;

  constructor() {
    this.AppState = new AppStateStore(this);
    this.InfrastructureStateStore = new InfrastructureStateStore(this);
    this.TasksStateStore = new TasksStateStore(this);
  }
}

export const rootStore = new RootStore();
