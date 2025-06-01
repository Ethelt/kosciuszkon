import styles from "@styles/components/Graph/CustomTooltip.module.scss";

interface Task {
  name: string;
  action?: string;
  description?: string;
  priority?: string | number;
  status?: string;
  id?: string | number;
  hourIndex?: number;
  estimatedUsage?: number;
}

interface PayloadEntry {
  dataKey: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadEntry[];
  label?: string | number;
  data: {
    tasks: Task[];
  };
}

export const CustomTooltip = ({
  active,
  payload,
  label,
  data,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.timeLabel}>Time: {label}</p>
        {payload.map((entry: PayloadEntry, index: number) => {
          if (entry.dataKey === "powerBalance") {
            return (
              <div
                key={index}
                className={styles.powerBalance}
                style={{ color: entry.color }}>
                <strong>Energy Balance: {entry.value}</strong>
              </div>
            );
          }

          const [name, hourIndex, taskId] = entry.dataKey.split("|");

          const task = data.tasks.find(t => {
            if (taskId && t.id) {
              return (
                t.id.toString() === taskId && t.hourIndex === Number(hourIndex)
              );
            }
            return t.name === name && t.hourIndex === Number(hourIndex);
          });

          if (task && entry.value > 0) {
            return (
              <div
                key={index}
                className={styles.taskEntry}
                style={{ borderLeftColor: entry.color }}>
                <div className={styles.taskName} style={{ color: entry.color }}>
                  {task.name}
                </div>
                <div className={styles.powerValue}>
                  Energy: {entry.value} kWh
                </div>
                {task.action && (
                  <div className={styles.taskDetail}>Action: {task.action}</div>
                )}
                {task.description && (
                  <div className={styles.taskDetail}>{task.description}</div>
                )}
                {task.priority && (
                  <div className={styles.taskDetail}>
                    Priority: {task.priority}
                  </div>
                )}
                {task.status && (
                  <div className={styles.taskDetail}>Status: {task.status}</div>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }
  return null;
};
