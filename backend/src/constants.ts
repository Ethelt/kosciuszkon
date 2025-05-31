import { SystemConfig } from "@arabska/shared/src/types";

export const DEFAULT_CONFIG: Omit<SystemConfig, 'id' | 'createdAt' | 'updatedAt'> = {
    maxInstallationPower: 10, // 10 kWp
    systemLosses: 14, // 14%
    installationTilt: 35, // 35 degrees
    maxBatteryCapacity: 13.5, // 13.5 kWh
    coordinates: {
        latitude: 52.2297, // Warsaw coordinates as default
        longitude: 21.0122,
    },
    panelHeight: 2, // 2 meters
    averageHourlyConsumption: 0.5, // 0.5 kWh
    maxComputingCenterPower: 2, // 2 kW
};

export const DEFAULT_TASK_STATUS = 'waiting';

export const FRAME_TIME_MS = 60 * 60 * 1000; // 1 hour in milliseconds