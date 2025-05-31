import { makeAutoObservable } from "mobx";

import { RootStore } from "./Root.store";

export class AppStateStore {
  DEV_MODE = import.meta.env.DEV || false;
  rootStore;
  // counter: number = 0;
  isSidebarCollapsed: boolean = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  // @action.bound addCounter() {
  //   this.counter += 1;
  // }

  toggleSidebar = () => {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  };
}
