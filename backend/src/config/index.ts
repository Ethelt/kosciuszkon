import { Database } from "sqlite3";
import { Express } from 'express';
import { getConfig, PartialConfigToUpdate, updateConfig } from "../config/model";
import { BaseApiErrorResponse, BaseApiSuccessResponse } from "../types";
import { SystemConfig } from "@arabska/shared/src/types";

export function addConfigRoutes(app: Express) {
    app.get("/config", async (req, res) => {
        const data = await getConfig()
        res.json(data);
    });

    app.post("/config", async (req, res) => {
        try {
            const configData = req.body as PartialConfigToUpdate;
            const updatedConfig = await updateConfig(configData);

            const response: BaseApiSuccessResponse<SystemConfig> = {
                success: true,
                data: updatedConfig
            };

            res.json(response);
        } catch (error) {
            const response: BaseApiErrorResponse = {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update configuration'
            };

            res.status(500).json(response);
        }
    });
}

export function createConfigTable(db: Database) {
    db.run(`
        CREATE TABLE IF NOT EXISTS system_config (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          max_installation_power REAL NOT NULL,
          system_losses REAL NOT NULL,
          installation_tilt REAL NOT NULL,
          max_battery_capacity REAL NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          panel_height REAL NOT NULL,
          average_hourly_consumption REAL NOT NULL,
          max_computing_center_power REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
}