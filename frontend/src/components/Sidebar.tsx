import { FC, useContext } from "react";
import { Clock, Home, Zap } from "lucide-react";
import { observer } from "mobx-react";
import { NavLink } from "react-router-dom";

import { StoreContext } from "@/store/StoreContext";

import styles from "@/styles/components/Sidebar.module.scss";

export const Sidebar: FC = observer(() => {
  const store = useContext(StoreContext);
  const { isSidebarCollapsed } = store.AppState;

  return (
    <div
      className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.contentContainer}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Zap />
          </div>
          <div className={styles.logoText}>
            <h1>GreenJob</h1>
            <p>Task Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          <h1 className={styles.navTitle}>Navigation</h1>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }>
            <Home size={24} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/infrastructure"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }>
            <Zap size={24} />
            <span>Solar Infrastructure</span>
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }>
            <Clock size={24} />
            <span>Task Management</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
});
