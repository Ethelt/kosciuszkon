export type SystemConfig = {
    id: number;
    maxInstallationPower: number; // maksymalna moc instalacji (kWp)
    systemLosses: number; // straty systemowe (%)
    installationTilt: number; // nachylenie instalacji (stopnie)
    maxBatteryCapacity: number; // maksymalna pojemność banku energi (kWh)
    coordinates: {
        latitude: number;
        longitude: number;
    }; // kordynaty geograficzne instalacji
    panelHeight: number; // wysokość na której zamontowane są panele (m)
    averageHourlyConsumption: number; // średnie stałe zużycie energi na godzinę
    maxComputingCenterPower: number; // maksymalna moc centrum obliczeniowego (max kW urządzenia)
    createdAt: string;
    updatedAt: string;
}