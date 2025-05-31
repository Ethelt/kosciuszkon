import { AppStateStore } from "./AppState.store";
import { DashboardLayoutStateStore } from "./DashboardLayoutState.store";

export class RootStore {
  AppState: AppStateStore;
  DashboardLayoutState: DashboardLayoutStateStore;

  constructor() {
    this.AppState = new AppStateStore(this);
    this.DashboardLayoutState = new DashboardLayoutStateStore(this);
  }
}

export const rootStore = new RootStore();
