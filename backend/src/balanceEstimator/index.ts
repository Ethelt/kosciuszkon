import { DateTime } from "luxon";
import { DateString } from "../utils";

export class BalanceEstimator {
  private balances: Map<`${DateString}-${number}`, number>;

  constructor() {
    this.balances = new Map();
  }

  getBalances(
    from: DateString,
    to: DateString
  ): {
    start: DateString;
    balances: { balance: number; freeDuration: number }[];
  } {
    const balances = [];
    for (let date = from; date <= to; date = addDays(date, 1)) {
      for (let hour = 0; hour < 24; hour++) {
        balances.push({
          balance: this.getBalance(date, hour),
          freeDuration: 60 * 60 * Math.random(),
        });
      }
    }
    return { start: from, balances };
  }

  private getBalance(date: DateString, hour: number): number {
    const key: `${DateString}-${number}` = `${date}-${hour}`;
    if (this.balances.has(key)) {
      return this.balances.get(key) || 0;
    }

    const balance = this.getDefaultBalance(date, hour);
    this.balances.set(key, balance);
    return balance;
  }

  private getDefaultBalance(date: DateString, hour: number): number {
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
