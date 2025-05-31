import { FC } from "react";
import { Outlet } from "react-router-dom";

import { Header, Sidebar } from "@/components";

import styles from "@/styles/pages/NavigationWrapper.module.scss";

export const NavigationWrapper: FC = () => {
  return (
    <main className={styles.mainContent}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <Header />
        <Outlet />
      </div>
    </main>
  );
};
