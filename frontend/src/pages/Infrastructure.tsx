import { FC, useContext, useEffect } from "react";
import { observer } from "mobx-react";

import { StoreContext } from "@/store/StoreContext";

import styles from "@/styles/pages/Infrastructure.module.scss";

export const Infrastructure: FC = observer(() => {
  const store = useContext(StoreContext);
  const { fetchData, formData, setFormData } = store.InfrastructureStateStore;

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataObject = new FormData(e.currentTarget);
    const data: IFormSystemConfig = {
      maxInstallationPower:
        Number(formDataObject.get("maxInstallationPower")) || 0,
      systemLosses: Number(formDataObject.get("systemLosses")) || 0,
      installationTilt: Number(formDataObject.get("installationTilt")) || 0,
      maxBatteryCapacity: Number(formDataObject.get("maxBatteryCapacity")) || 0,
      panelHeight: Number(formDataObject.get("panelHeight")) || 0,
      averageHourlyConsumption:
        Number(formDataObject.get("averageHourlyConsumption")) || 0,
      maxComputingCenterPower:
        Number(formDataObject.get("maxComputingCenterPower")) || 0,
      coordinates: {
        latitude: Number(formDataObject.get("latitude")) || 50.0647,
        longitude: Number(formDataObject.get("longitude")) || 19.945,
      },
    };

    setFormData(data);
  };

  return (
    <div className={styles.infrastructure}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.formLabel}>
          Maximum Installation Power (kWp):
          <input
            className={styles.formInput}
            type="number"
            name="maxInstallationPower"
            step="any"
            min={0}
            defaultValue={formData.maxInstallationPower || ""}
          />
        </label>
        <label className={styles.formLabel}>
          System Losses (%):
          <input
            className={styles.formInput}
            type="number"
            name="systemLosses"
            step="any"
            min={0}
            defaultValue={formData.systemLosses || ""}
          />
        </label>
        <label className={styles.formLabel}>
          Installation Tilt (degrees):
          <input
            className={styles.formInput}
            type="number"
            name="installationTilt"
            step="any"
            defaultValue={formData.installationTilt || ""}
            min={0}
            max={90}
          />
        </label>
        <label className={styles.formLabel}>
          Maximum Battery Capacity (kWh):
          <input
            className={styles.formInput}
            type="number"
            name="maxBatteryCapacity"
            step="any"
            min={0}
            defaultValue={formData.maxBatteryCapacity || ""}
          />
        </label>
        <label className={styles.formLabel}>
          Panel Height (m):
          <input
            className={styles.formInput}
            type="number"
            name="panelHeight"
            step="any"
            min={0}
            defaultValue={formData.panelHeight || ""}
          />
        </label>
        <label className={styles.formLabel}>
          Average Hourly Consumption (kWh):
          <input
            className={styles.formInput}
            type="number"
            name="averageHourlyConsumption"
            step="any"
            min={0}
            defaultValue={formData.averageHourlyConsumption || ""}
          />
        </label>
        <label className={styles.formLabel}>
          Maximum Computing Center Power (kW):
          <input
            className={styles.formInput}
            type="number"
            name="maxComputingCenterPower"
            step="any"
            min={0}
            defaultValue={formData.maxComputingCenterPower || ""}
          />
        </label>
        {formData.coordinates && (
          <>
            <label className={styles.formLabel}>
              Latitude:
              <input
                className={styles.formInput}
                type="number"
                name="latitude"
                step="any"
                min={-90}
                max={90}
                defaultValue={formData.coordinates?.latitude || 50.0647}
              />
            </label>
            <label className={styles.formLabel}>
              Longitude:
              <input
                className={styles.formInput}
                type="number"
                name="longitude"
                step="any"
                min={-180}
                max={180}
                defaultValue={formData.coordinates?.longitude || 19.945}
              />
            </label>
          </>
        )}
        <div className={styles.formButtonContainer}>
          <button className={styles.formButton} type="submit">
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
});
