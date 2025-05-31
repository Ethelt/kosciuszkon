import { FC, useContext, useEffect } from "react";
import { observer } from "mobx-react";

import { StoreContext } from "@/store/StoreContext";

import styles from "@/styles/pages/Infrastructure.module.scss";

export const Infrastructure: FC = observer(() => {
  const store = useContext(StoreContext);
  const { fetchData } = store.InfrastructureStateStore;
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div className={styles.infrastructure}>
      <form className={styles.form}>
        <label className={styles.formLabel}>
          Maksymalna moc instalacji (kWp):
          <input
            className={styles.formInput}
            type="number"
            name="maxInstallationPower"
            step="any"
          />
        </label>
        <label className={styles.formLabel}>
          Straty systemowe (%):
          <input
            className={styles.formInput}
            type="number"
            name="systemLosses"
            step="any"
          />
        </label>
        <label className={styles.formLabel}>
          Nachylenie instalacji (stopnie):
          <input
            className={styles.formInput}
            type="number"
            name="installationTilt"
            step="any"
          />
        </label>
        <label className={styles.formLabel}>
          Maksymalna pojemność banku energii (kWh):
          <input
            className={styles.formInput}
            type="number"
            name="maxBatteryCapacity"
            step="any"
          />
        </label>
        <label className={styles.formLabel}>
          Wysokość montażu paneli (m):
          <input
            className={styles.formInput}
            type="number"
            name="panelHeight"
            step="any"
          />
        </label>
        <label className={styles.formLabel}>
          Średnie stałe zużycie energii na godzinę:
          <input
            className={styles.formInput}
            type="number"
            name="averageHourlyConsumption"
            step="any"
          />
        </label>
        <label className={styles.formLabel}>
          Maksymalna moc centrum obliczeniowego (kW):
          <input
            className={styles.formInput}
            type="number"
            name="maxComputingCenterPower"
            step="any"
          />
        </label>
        <button className={styles.formButton} type="submit">
          Zapisz
        </button>
      </form>
    </div>
  );
});
