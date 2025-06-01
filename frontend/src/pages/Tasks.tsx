import { FC, useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";

import { StoreContext } from "@/store/StoreContext";

import styles from "@/styles/pages/Tasks.module.scss";

export const Tasks: FC = observer(() => {
  const navigate = useNavigate();
  const store = useContext(StoreContext);
  const { fetchTasks, taskList, setCurrentTask, deleteTask } =
    store.TasksStateStore;
  const [activeFilter, setActiveFilter] = useState<ITaskStatuses | "all">(
    "all",
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Calculate task statistics
  const activeTasks = taskList.filter(
    task => task.status === "succeeded",
  ).length;
  const pausedTasks = taskList.filter(task => task.status === "waiting").length;
  const errorTasks = taskList.filter(task => task.status === "failed").length;
  const totalTasks = taskList.length;

  // Filter tasks based on active filter
  const filteredTasks =
    activeFilter === "all"
      ? taskList
      : taskList.filter(task => task.status === activeFilter);

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const handleFilterClick = (filter: ITaskStatuses | "all") => {
    setActiveFilter(filter);
  };

  return (
    <div className={styles.tasks}>
      {/* Task Statistics Cards */}
      <div className={styles.statsGrid}>
        <div
          className={`${styles.statCard} ${styles.active} ${activeFilter === "succeeded" ? styles.selected : ""}`}
          onClick={() => handleFilterClick("succeeded")}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Successful Tasks</span>
            <span className={styles.statIcon}>✅</span>
          </div>
          <div className={styles.statValue}>{activeTasks}</div>
        </div>

        <div
          className={`${styles.statCard} ${styles.paused} ${activeFilter === "waiting" ? styles.selected : ""}`}
          onClick={() => handleFilterClick("waiting")}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Waiting Tasks</span>
            <span className={styles.statIcon}>⏸️</span>
          </div>
          <div className={styles.statValue}>{pausedTasks}</div>
        </div>

        <div
          className={`${styles.statCard} ${styles.error} ${activeFilter === "failed" ? styles.selected : ""}`}
          onClick={() => handleFilterClick("failed")}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Failed Tasks</span>
            <span className={styles.statIcon}>⚠️</span>
          </div>
          <div className={styles.statValue}>{errorTasks}</div>
        </div>

        <div
          className={`${styles.statCard} ${styles.total} ${activeFilter === "all" ? styles.selected : ""}`}
          onClick={() => handleFilterClick("all")}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Total Tasks</span>
            <span className={styles.statIcon}>🔄</span>
          </div>
          <div className={styles.statValue}>{totalTasks}</div>
        </div>
      </div>

      {/* Filter indicator */}
      <div className={styles.filterIndicator}>
        {activeFilter === "all"
          ? "All Tasks"
          : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Tasks (${filteredTasks.length} of ${totalTasks})`}
      </div>

      {/* Task List */}
      <div className={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No tasks found</h3>
            <p>No tasks match the current filter criteria.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={styles.taskCard}>
              <div className={styles.taskHeader}>
                <div className={styles.taskTitle}>
                  <h3>{task.name}</h3>
                  <span
                    className={`${styles.statusBadge} ${styles[task.status]}`}>
                    {task.status}
                  </span>
                </div>
                <div className={styles.taskActions}>
                  <button
                    className={styles.actionButton}
                    title="Edit"
                    onClick={() => {
                      setCurrentTask(task);
                      navigate("/tasks/edit");
                    }}>
                    ✏️
                  </button>
                  <button
                    className={styles.actionButton}
                    title="Delete"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this task?",
                        )
                      ) {
                        deleteTask(task.id);
                      }
                    }}>
                    🗑️
                  </button>
                </div>
              </div>

              <p className={styles.taskDescription}>{task.description}</p>

              <div className={styles.taskDetails}>
                <div className={styles.taskSection}>
                  <span className={styles.sectionIcon}>⚡</span>
                  <div className={styles.sectionContent}>
                    <span className={styles.sectionLabel}>Command</span>
                    <code className={styles.commandText}>
                      {task.action || "/usr/local/bin/task-script.sh"}
                    </code>
                  </div>
                </div>

                <div className={styles.taskSection}>
                  <span className={styles.sectionIcon}>🔥</span>
                  <div className={styles.sectionContent}>
                    <span className={styles.sectionLabel}>Priority</span>
                    <span className={styles.priorityText}>
                      {task.priority || "Priority not set"}
                    </span>
                  </div>
                </div>

                <div className={styles.taskSection}>
                  <span className={styles.sectionIcon}>🕐</span>
                  <div className={styles.sectionContent}>
                    <span className={styles.sectionLabel}>Execution</span>
                    <div className={styles.executionTimes}>
                      <div className={styles.planned}>
                        {`Planned: ${formatDateTime(
                          task.plannedExecutionTime || "Not found",
                        )}`}
                      </div>
                      <div>
                        {task.range.start && task.range.end
                          ? `Allowed between: ${formatDateTime(task.range.start)} - ${formatDateTime(task.range.end)}`
                          : task.range.start
                            ? `Allowed after: ${formatDateTime(task.range.start)}`
                            : task.range.end
                              ? `Allowed before: ${formatDateTime(task.range.end)}`
                              : "Range: Not set"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
