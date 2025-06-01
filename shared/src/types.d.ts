// Config types

export type SystemConfig = {
    id: number
    maxInstallationPower: number // maksymalna moc instalacji (kWp)
    systemLosses: number // straty systemowe (%)
    installationTilt: number // nachylenie instalacji (stopnie)
    maxBatteryCapacity: number // maksymalna pojemność banku energi (kWh)
    coordinates: {
        latitude: number
        longitude: number
    } // kordynaty geograficzne instalacji
    panelHeight: number // wysokość na której zamontowane są panele (m)
    averageHourlyConsumption: number // średnie stałe zużycie energi na godzinę
    maxComputingCenterPower: number // maksymalna moc centrum obliczeniowego (max kW urządzenia)
    createdAt: string
    updatedAt: string
}

// Task types

export type TaskPriorities = 'low' | 'medium' | 'high' | 'critical'
export type TaskStatuses = 'waiting' | 'succeeded' | 'failed'

export type TaskRepeating = {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval?: number // interval between occurrences
    byWeekDay?: number[] // 0-6 for Sunday-Saturday
    byMonthDay?: number[] // 1-31
    byMonth?: number[] // 1-12
    byYearDay?: number[] // 1-366
    count?: number // number of occurrences
    until?: string // ISO date string
    startDate: string // ISO date string
}

export type Task = {
    id: number
    name: string
    action: string // command to execude
    description?: string
    priority: TaskPriorities
    status: TaskStatuses
    range: {
        // the scope within which the task is to be performed, specified by user
        start?: string // ISO date string
        end?: string // ISO date string
    }
    estimatedWorkingTime?: number // in seconds
    estimatedWorkload?: number // in percentage
    repeating?: TaskRepeating
    plannedExecutionTime?: string // ISO date string, when we plan to execute task
    createdAt: string
    updatedAt: string
}

// Dashboard chat types

export type ChartHour = {
    balance: number
    label: string
}

export type ChartTask = Pick<
    Task,
    | 'id'
    | 'name'
    | 'action'
    | 'plannedExecutionTime'
    | 'priority'
    | 'description'
> & {
    hourIndex: number
    estimatedUsage: number
}

export type DashboardChartData = {
    hours: ChartHour[]
    tasks: ChartTask[]
}
