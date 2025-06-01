import { makeAutoObservable } from "mobx";

import { AddTaskButton } from "@/components";

import { RootStore } from "./Root.store";

const headerContent: Record<string, IHeaderData> = {
  "/": {
    title: "Dashboard",
    description: "Energy Management Overview",
    content: null,
  },
  "/infrastructure": {
    title: "Solar Infrastructure",
    description: "Configure and monitor system parameters",
    content: null,
  },
  "/tasks": {
    title: "Tasks",
    description: "Manage processing center cron jobs and scheduled tasks",
    content: AddTaskButton,
  },
  "/tasks/add": {
    title: "Tasks",
    description: "Manage processing center cron jobs and scheduled tasks",
    content: null,
  },
  "/tasks/edit": {
    title: "Tasks",
    description: "Manage processing center cron jobs and scheduled tasks",
    content: null,
  },
};

export class AppStateStore {
  DEV_MODE = import.meta.env.DEV || false;
  rootStore;
  // counter: number = 0;
  isSidebarCollapsed: boolean = false;
  currentPage: IHeaderData = headerContent["/"]; // Default page

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  // @action.bound addCounter() {
  //   this.counter += 1;
  // }

  setCurrentPage = (page: keyof typeof headerContent) => {
    console.log(headerContent[page]);
    this.currentPage = headerContent[page];
  };

  toggleSidebar = () => {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  };
}
