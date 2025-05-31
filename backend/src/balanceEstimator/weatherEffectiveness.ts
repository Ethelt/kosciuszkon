import { DateTime } from "luxon";

export async function getWeather(latitude: number, longitude: number) {
  const startDate = DateTime.now().toISO()!.split("T")[0];
  const endDate = DateTime.now().plus({ days: 7 }).toISO()!.split("T")[0];
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m,snow_depth,cloud_cover,sunshine_duration`
  );
  const data = (await response.json()) as Response;
  const hours = data.hourly.time.map((time, index) => {
    const date = DateTime.fromISO(time, { zone: "utc" }).toISO()!;

    return {
      date,
      effectiveness: calculateSolarPanelEffectiveness(
        data.hourly.sunshine_duration[index],
        data.hourly.temperature_2m[index],
        data.hourly.cloud_cover[index],
        data.hourly.snow_depth[index]
      ),
    };
  });

  return hours;
}

/**
 * Calculates hourly solar panel effectiveness as a ratio of ideal conditions
 *
 * @param sunshineDuration - Duration of sunshine in seconds (0-3600)
 * @param temperature - Temperature in Celsius
 * @param cloudCover - Cloud cover percentage (0-100)
 * @param snowDepth - Snow depth in meters
 * @returns Solar panel effectiveness as ratio (0-1+)
 */
function calculateSolarPanelEffectiveness(
  sunshineDuration: number,
  temperature: number,
  cloudCover: number,
  snowDepth: number
): number {
  // Standard test condition temperature
  const STANDARD_TEMP = 25;

  // Temperature coefficient (0.4% loss per degree above 25°C)
  const TEMP_COEFFICIENT = 0.004;

  // Maximum cloud cover reduction factor
  const CLOUD_REDUCTION_FACTOR = 0.75;

  // Snow depth factor (complete blockage at 2cm)
  const SNOW_BLOCKAGE_FACTOR = 50;

  // Calculate individual factors
  const sunshineFactor = Math.min(sunshineDuration / 3600, 1.0);
  const temperatureFactor =
    1 - (temperature - STANDARD_TEMP) * TEMP_COEFFICIENT;
  const cloudFactor = 1 - (cloudCover / 100) * CLOUD_REDUCTION_FACTOR;
  const snowFactor = Math.max(0, 1 - snowDepth * SNOW_BLOCKAGE_FACTOR);

  // Calculate final effectiveness as ratio of ideal conditions
  const effectiveness =
    sunshineFactor * temperatureFactor * cloudFactor * snowFactor;

  return effectiveness;
}

interface Response {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly: Hourly;
}
interface Hourly {
  time: string[];
  temperature_2m: number[];
  snow_depth: number[];
  cloud_cover: number[];
  sunshine_duration: number[];
}
