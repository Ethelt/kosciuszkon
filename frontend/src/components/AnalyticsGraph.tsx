import { FC, useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";

import { Graph } from "@/components";
import { StoreContext } from "@/store/StoreContext";

import styles from "@/styles/pages/Dashboard.module.scss";

export const AnalyticsGraph: FC = observer(() => {
  const store = useContext(StoreContext);
  const { chartData, getChartData } = store.ChartStateStore;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    getChartData(selectedDate);
  }, [getChartData, selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };

  return (
    <>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>📊</span>
        <h3>Task Analytics</h3>
        <div className={styles.dateInput}>
          <input
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={handleDateChange}
            className={styles.datePicker}
          />
        </div>
      </div>
      <div className={styles.graphContainer}>
        <Graph data={chartData} />
      </div>
    </>
  );
});
