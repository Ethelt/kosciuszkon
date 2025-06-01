import { FC, useContext, useEffect } from "react";
import { observer } from "mobx-react";

import { AnalyticsGraph } from "@/components/AnalyticsGraph";
import { StoreContext } from "@/store/StoreContext";

import styles from "@/styles/pages/Dashboard.module.scss";

export const Dashboard: FC = observer(() => {
  const store = useContext(StoreContext);
  const { fetchTasks, taskList } = store.TasksStateStore;

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const activeTasks = taskList.filter(
    task => task.status === "succeeded",
  ).length;
  const pausedTasks = taskList.filter(task => task.status === "waiting").length;
  const errorTasks = taskList.filter(task => task.status === "failed").length;
  const totalTasks = taskList.length;

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.active}`}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Successful Tasks</span>
            <span className={styles.statIcon}>✅</span>
          </div>
          <div className={styles.statValue}>{activeTasks}</div>
        </div>

        <div className={`${styles.statCard} ${styles.paused}`}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Waiting Tasks</span>
            <span className={styles.statIcon}>⏸️</span>
          </div>
          <div className={styles.statValue}>{pausedTasks}</div>
        </div>

        <div className={`${styles.statCard} ${styles.error}`}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Failed Tasks</span>
            <span className={styles.statIcon}>⚠️</span>
          </div>
          <div className={styles.statValue}>{errorTasks}</div>
        </div>

        <div className={`${styles.statCard} ${styles.total}`}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Total Tasks</span>
            <span className={styles.statIcon}>🔄</span>
          </div>
          <div className={styles.statValue}>{totalTasks}</div>
        </div>
      </div>

      <div className={styles.graphSection}>
        <AnalyticsGraph />
      </div>
    </div>
  );
});
