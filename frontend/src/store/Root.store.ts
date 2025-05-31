import { AppStateStore } from "./AppState.store";
import { InfrastructureStateStore } from "./InfrastructureState.store";

export class RootStore {
  AppState: AppStateStore;
  InfrastructureStateStore: InfrastructureStateStore;

  constructor() {
    this.AppState = new AppStateStore(this);
    this.InfrastructureStateStore = new InfrastructureStateStore(this);
  }
}

export const rootStore = new RootStore();
