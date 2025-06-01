import { DateTime } from "luxon";
import { getConfig } from "../config/model";
import { getWeather } from "./weatherEffectiveness";
import { getAverageEffectiveness } from "./averageEffectiveness";

export class BalanceEstimator {
  private balances: Map<string, number>;
  private dailyAveragesPerMonth: number[] = [];

  constructor() {
    this.balances = new Map();
  }

  async getDefaultAverages() {
    const config = await getConfig();
    this.dailyAveragesPerMonth = await getAverageEffectiveness(config);
  }

  async calculateBalancesForNextWeek() {
    const config = await getConfig();
    const weather = await getWeather(
      config.coordinates.latitude,
      config.coordinates.longitude
    );
    weather.forEach((hour) => {
      this.balances.set(
        hour.date,
        config.maxInstallationPower * hour.effectiveness
      );
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

    return this.dailyAveragesPerMonth[date.month - 1] * hourlyEffectiveness;
  }
}
