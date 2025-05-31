import { DEFAULT_CONFIG } from "../constants";
import { dbGet, dbRun } from "../db";
import { SystemConfig } from "@arabska/shared/src/types";

export async function getConfig(): Promise<SystemConfig> {
    const row = await dbGet<SystemConfig>('SELECT * FROM system_config WHERE id = 1');

    if (!row) {
        // If no config exists, create default one
        return _createDefaultConfig();
    }

    return {
        id: row.id,
        maxInstallationPower: row.max_installation_power,
        systemLosses: row.system_losses,
        installationTilt: row.installation_tilt,
        maxBatteryCapacity: row.max_battery_capacity,
        coordinates: {
            latitude: row.latitude,
            longitude: row.longitude,
        },
        panelHeight: row.panel_height,
        averageHourlyConsumption: row.average_hourly_consumption,
        maxComputingCenterPower: row.max_computing_center_power,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

// Create default configuration
async function _createDefaultConfig(): Promise<SystemConfig> {
    const now = new Date().toISOString();

    await dbRun(
        `INSERT INTO system_config (
        id,
        max_installation_power,
        system_losses,
        installation_tilt,
        max_battery_capacity,
        latitude,
        longitude,
        panel_height,
        average_hourly_consumption,
        max_computing_center_power,
        created_at,
        updated_at
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            DEFAULT_CONFIG.maxInstallationPower,
            DEFAULT_CONFIG.systemLosses,
            DEFAULT_CONFIG.installationTilt,
            DEFAULT_CONFIG.maxBatteryCapacity,
            DEFAULT_CONFIG.coordinates.latitude,
            DEFAULT_CONFIG.coordinates.longitude,
            DEFAULT_CONFIG.panelHeight,
            DEFAULT_CONFIG.averageHourlyConsumption,
            DEFAULT_CONFIG.maxComputingCenterPower,
            now,
            now,
        ]
    );

    return {
        id: 1,
        ...DEFAULT_CONFIG,
        createdAt: now,
        updatedAt: now,
    };
}

// Update system configuration
export type PartialConfigToUpdate = Partial<Omit<SystemConfig, 'id' | 'createdAt' | 'updatedAt'>>;
export async function updateConfig(config: PartialConfigToUpdate): Promise<SystemConfig> {
    const currentConfig = await getConfig();
    const updatedConfig = { ...currentConfig, ...config };
    const now = new Date().toISOString();

    await dbRun(
        `UPDATE system_config SET
        max_installation_power = ?,
        system_losses = ?,
        installation_tilt = ?,
        max_battery_capacity = ?,
        latitude = ?,
        longitude = ?,
        panel_height = ?,
        average_hourly_consumption = ?,
        max_computing_center_power = ?,
        updated_at = ?
      WHERE id = 1`,
        [
            updatedConfig.maxInstallationPower,
            updatedConfig.systemLosses,
            updatedConfig.installationTilt,
            updatedConfig.maxBatteryCapacity,
            updatedConfig.coordinates.latitude,
            updatedConfig.coordinates.longitude,
            updatedConfig.panelHeight,
            updatedConfig.averageHourlyConsumption,
            updatedConfig.maxComputingCenterPower,
            now,
        ]
    );

    return {
        ...updatedConfig,
        updatedAt: now,
    };
}
