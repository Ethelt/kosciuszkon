import { DateTime } from "luxon";
import { getConfig } from "../config/model";
import { getWeather } from "./weatherEffectiveness";
import { getAverageEffectiveness } from "./averageEffectiveness";

class BalanceEstimator {
  private balances: Map<string, number>;
  private dailyAveragesPerMonth: number[] = [];
  private config: any;

  constructor() {
    this.balances = new Map();
  }

  async initialize() {
    this.config = await getConfig();
    this.dailyAveragesPerMonth = await getAverageEffectiveness(this.config);
    await this.getBalancesForNextWeek();
  }

  async getDefaultAverages() {
    this.dailyAveragesPerMonth = await getAverageEffectiveness(this.config);
  }

  async getBalancesForNextWeek() {
    const weather = await getWeather(
      this.config.coordinates.latitude,
      this.config.coordinates.longitude
    );
    weather.forEach((hour) => {
      const energyIncome =
        this.config.maxInstallationPower * hour.effectiveness;
      const energyCost = this.getEnergyCost(hour.date);
      this.balances.set(hour.date, energyIncome - energyCost);
    });
  }

  getBalances(
    from: DateTime,
    to: DateTime
  ): {
    start: DateTime;
    balances: { balance: number; freeDuration: number; time: DateTime }[];
  } {
    const balances = [];
    let currentDateTime = from;

    while (currentDateTime < to) {
      balances.push({
        time: currentDateTime,
        balance: this.getBalance(currentDateTime),
        freeDuration: 60 * 60,
      });
      currentDateTime = currentDateTime.plus({ hours: 1 });
    }

    return { start: from, balances };
  }

  private getBalance(date: DateTime): number {
    const key = date.setZone("UTC").toISO()!;
    if (this.balances.has(key)) {
      return this.balances.get(key) || 0;
    }

    const balance = this.getDefaultBalance(date);
    this.balances.set(key, balance);
    return balance;
  }

  private getDefaultBalance(date: DateTime): number {
    const hour = date.hour;
    // Calculate solar panel effectiveness based on hour of the day and seasonal daylight hours in Poland
    // Peak effectiveness is around solar noon, with gradual decline towards sunrise/sunset
    let hourlyEffectiveness = 0;

    // Daylight hours in Poland by month (approximate values for central Poland ~52°N)
    const daylightHoursByMonth = [
      8.5, // January
      10.0, // February
      11.8, // March
      13.8, // April
      15.5, // May
      16.8, // June
      16.5, // July
      15.2, // August
      13.3, // September
      11.3, // October
      9.2, // November
      8.0, // December
    ];

    const daylightHours = daylightHoursByMonth[date.month - 1];
    const solarNoon = 12; // Solar noon at 12:00
    const sunriseHour = solarNoon - daylightHours / 2;
    const sunsetHour = solarNoon + daylightHours / 2;

    if (hour >= sunriseHour && hour <= sunsetHour) {
      // Solar panels only generate power during daylight hours
      // Use a sine wave to model the sun's path, with peak at solar noon
      const hoursFromSunrise = hour - sunriseHour;
      const sinePosition = (hoursFromSunrise / daylightHours) * Math.PI;
      hourlyEffectiveness = Math.sin(sinePosition);
    }

    const energyIncome =
      this.dailyAveragesPerMonth[date.month - 1] * hourlyEffectiveness;
    const energyCost = this.getEnergyCost(date.toISO()!);
    return energyIncome - energyCost;
  }

  private getEnergyCost(date: string): number {
    const baseConsumption = this.config.averageHourlyConsumption;

    const dateTime = DateTime.fromISO(date);
    const hour = dateTime.hour;

    // Data center energy usage pattern - higher during business hours, lower at night
    // Peak usage during business hours (9-17), moderate in evening (18-22), lowest at night (23-8)
    let hourlyMultiplier = 1.0;

    if (hour >= 9 && hour <= 17) {
      // Business hours - peak usage (110-130% of base)
      hourlyMultiplier = 1.1 + 0.2 * Math.sin(((hour - 9) / 8) * Math.PI);
    } else if (hour >= 18 && hour <= 22) {
      // Evening hours - moderate usage (90-110% of base)
      hourlyMultiplier = 0.9 + 0.2 * Math.sin(((hour - 18) / 4) * Math.PI);
    } else {
      // Night hours (23-8) - lowest usage (70-90% of base)
      const nightHour = hour >= 23 ? hour - 23 : hour + 1; // Normalize to 0-9 range
      hourlyMultiplier = 0.7 + 0.2 * Math.sin((nightHour / 9) * Math.PI);
    }

    return baseConsumption * hourlyMultiplier;
  }
}

let balanceEstimator: BalanceEstimator;

export async function getBalanceEstimator(): Promise<BalanceEstimator> {
  if (!balanceEstimator) {
    balanceEstimator = new BalanceEstimator();
    await balanceEstimator.initialize();
  }
  return balanceEstimator;
}
