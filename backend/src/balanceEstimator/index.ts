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
    balances: { balance: number; freeDuration: number }[];
  } {
    const balances = [];
    let currentDateTime = from;

    while (currentDateTime < to) {
      balances.push({
        time: currentDateTime,
        balance: this.getBalance(currentDateTime),
        freeDuration: 60 * 60 * Math.random(),
      });
      currentDateTime = currentDateTime.plus({ hours: 1 });
    }

    return { start: from, balances };
  }

  private getBalance(date: DateTime): number {
    const key = date.toISO()!;
    if (this.balances.has(key)) {
      return this.balances.get(key) || 0;
    }

    const balance = this.getDefaultBalance(date);
    this.balances.set(key, balance);
    return balance;
  }

  private getDefaultBalance(date: DateTime): number {
    const hour = date.hour;
    // Calculate solar panel effectiveness based on hour of the day
    // Peak effectiveness is around noon (12:00), with gradual decline towards sunrise/sunset
    let hourlyEffectiveness = 0;

    if (hour >= 6 && hour <= 18) {
      // Solar panels only generate power during daylight hours (6 AM to 6 PM)
      // Use a sine wave to model the sun's path, with peak at noon
      const hoursFromSunrise = hour - 6;
      const dayLightHours = 12;
      const sinePosition = (hoursFromSunrise / dayLightHours) * Math.PI;
      hourlyEffectiveness = Math.sin(sinePosition);
    }

    return this.dailyAveragesPerMonth[date.month - 1] * hourlyEffectiveness;
  }
}
