import { createContext, StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { rootStore } from "./store/Root.store";

import "@styles/index.scss";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

export const StoreContext = createContext(rootStore);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
