import { makeAutoObservable } from "mobx";
import { Layouts } from "react-grid-layout";

import { RootStore } from "./Root.store";

interface IDashboardElement {
  id: string;
  title: string;
}

export class DashboardLayoutStateStore {
  rootStore;
  storeLayouts: Layouts = {};
  widgets: IDashboardElement[] = [];

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    // this.layouts = {};
    this.widgets = [
      { id: "widget1", title: "Widget 1" },
      { id: "widget2", title: "Widget 2" },
      { id: "widget3", title: "Widget 3" },
      { id: "widget4", title: "Widget 4" },
      { id: "widget5", title: "Widget 5" },
      { id: "widget6", title: "Widget 6" },
      { id: "widget7", title: "Widget 7" },
      { id: "widget8", title: "Widget 8" },
      { id: "widget9", title: "Widget 9" },
      { id: "widget10", title: "Widget 10" },
    ];
  }
}
