import { FC, useContext } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { observer } from "mobx-react";

import { StoreContext } from "@/store/StoreContext";

import styles from "@/styles/components/Header.module.scss";

export const Header: FC = observer(() => {
  const store = useContext(StoreContext);
  const { toggleSidebar, currentPage, isSidebarCollapsed } = store.AppState;
  return (
    <header className={styles.header}>
      <button
        type="button"
        title="open/close menu"
        onClick={toggleSidebar}
        className={styles.headerButton}>
        {isSidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
      </button>
      <div className={styles.headerContent}>
        <h1 className={styles.headerTitle}>{currentPage.title}</h1>
        <p className={styles.headerDescription}>{currentPage.description}</p>
      </div>
      {currentPage.content && (
        <div className={styles.headerCustomContent}>{currentPage.content}</div>
      )}
    </header>
  );
});
