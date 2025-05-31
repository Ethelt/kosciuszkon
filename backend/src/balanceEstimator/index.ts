import { DateTime } from "luxon";
import { DateString } from "../utils";
import { getConfig } from "../config/model";
import { getWeather } from "./weatherEffectiveness";

export class BalanceEstimator {
  private balances: Map<string, number>;

  constructor() {
    this.balances = new Map();
  }

  async calculateBalances() {
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

    const balance = this.getDefaultBalance(key);
    this.balances.set(key, balance);
    return balance;
  }

  private getDefaultBalance(date: string): number {
    return Math.floor(Math.random() * 1000);
  }
}

function addDays(
  date: DateString,
  days: number
): `${number}-${number}-${number}` {
  const newDate = DateTime.fromISO(date) as DateTime<true>;
  return newDate
    .plus({ days })
    .toISO()
    .split("T")[0] as `${number}-${number}-${number}`;
}
