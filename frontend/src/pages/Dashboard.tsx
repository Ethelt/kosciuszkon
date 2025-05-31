import { FC } from "react";

import styles from "@/styles/pages/Dashboard.module.scss";

export const Dashboard: FC = () => {
  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1>Dashboard</h1>
          <p>Solar Energy Management Overview</p>
        </div>
        <div className={styles.systemStatus}>
          <div className={styles.statusDot}></div>
          System Online
        </div>
      </div>

      {/* Top Metrics */}
      <div className={styles.metricsFlex}>
        {/* Current Production */}
        <div className={styles.metricsCard}>
          <div className={styles.cardHeader}>
            <h3>Current Production</h3>
            <span>☀️</span>
          </div>
          <div className={styles.metricValue}>4.2 kW</div>
          <div className={styles.metricChange}>↗ +12% from yesterday</div>
        </div>

        {/* Daily Production */}
        <div className={styles.metricsCard}>
          <div className={styles.cardHeader}>
            <h3>Daily Production</h3>
            <span>⚡</span>
          </div>
          <div className={styles.metricValue}>28.5 kWh</div>
          <div className={styles.metricTarget}>Target: 35 kWh</div>
        </div>

        {/* Battery Level */}
        <div className={styles.metricsCard}>
          <div className={styles.cardHeader}>
            <h3>Battery Level</h3>
            <span>🔋</span>
          </div>
          <div className={styles.metricValue}>78%</div>
          <div className={styles.batteryBar}>
            <div className={styles.batteryFill} style={{ width: "78%" }}></div>
          </div>
        </div>

        {/* Grid Status */}
        <div className={styles.metricsCard}>
          <div className={styles.cardHeader}>
            <h3>Grid Status</h3>
            <span>📡</span>
          </div>
          <div className={styles.gridStatus}>Connected</div>
          <div className={styles.gridConnection}>Stable connection</div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.bottomFlex}>
        {/* Solar Infrastructure */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>⚡</span>
            <h3>Solar Infrastructure</h3>
          </div>
          <p className={styles.sectionDesc}>
            Quick access to system parameters
          </p>

          <div className={styles.parametersList}>
            <div className={styles.parametersParameter}>
              <span>Panel Efficiency</span>
              <span className={styles.parametersValue}>94.2%</span>
            </div>
            <div className={styles.parametersParameter}>
              <span>Inverter Status</span>
              <span className={styles.statusOnline}>Online</span>
            </div>
            <div className={styles.parametersParameter}>
              <span>Last Maintenance</span>
              <span className={styles.parametersDate}>2 days ago</span>
            </div>
          </div>

          <button className={styles.primaryButton}>
            <span>⚙️</span>
            Configure Parameters
          </button>
        </div>

        {/* Task Management */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>⏰</span>
            <h3>Task Management</h3>
          </div>
          <p className={styles.sectionDesc}>Processing center tasks overview</p>

          <div className={styles.taskStats}>
            <div className={styles.taskStat}>
              <div className={styles.taskNumber}>3</div>
              <div className={styles.taskLabel}>Active Tasks</div>
            </div>
            <div className={styles.taskStat}>
              <div className={styles.taskNumber}>12</div>
              <div className={styles.taskLabel}>Completed Today</div>
            </div>
          </div>

          <div className={styles.tasksList}>
            <div className={styles.taskTask}>
              <span>Data Backup</span>
              <span className={styles.statusRunning}>Running</span>
            </div>
            <div className={styles.taskTask}>
              <span>System Health Check</span>
              <span className={styles.statusScheduled}>Scheduled</span>
            </div>
          </div>

          <button className={styles.secondaryButton}>
            <span>+</span>
            Manage Tasks
          </button>
        </div>

        {/* System Alerts */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>⚠️</span>
            <h3>System Alerts</h3>
          </div>
          <p className={styles.sectionDesc}>
            Recent notifications and warnings
          </p>

          <div className={styles.alertsList}>
            <div className={styles.alertsSuccess}>
              <span>✅</span>
              <div className={styles.alertContent}>
                <div className={styles.alertTitle}>Maintenance Complete</div>
                <div className={styles.alertDesc}>
                  Panel cleaning finished successfully
                </div>
              </div>
            </div>
            <div className={styles.alertsWarning}>
              <span>📈</span>
              <div className={styles.alertContent}>
                <div className={styles.alertTitle}>Peak Production</div>
                <div className={styles.alertDesc}>
                  System reached 95% efficiency today
                </div>
              </div>
            </div>
          </div>

          <button className={styles.linkButton}>View All Alerts</button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        <div className={styles.actionButtons}>
          <button className={styles.primaryButton}>Generate Report</button>
          <button className={styles.secondaryButton}>
            Schedule Maintenance
          </button>
          <button className={styles.secondaryButton}>Export Data</button>
        </div>
      </div>
    </div>
  );
};
