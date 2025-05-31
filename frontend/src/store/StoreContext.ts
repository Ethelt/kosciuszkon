import { createContext } from "react";

import { rootStore } from "./Root.store";

export const StoreContext = createContext(rootStore);
