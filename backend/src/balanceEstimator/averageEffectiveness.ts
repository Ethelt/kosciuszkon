import { SystemConfig } from "@arabska/shared/src/types";

export async function getAverageEffectiveness(config: SystemConfig) {
  const response = await fetch(
    `https://re.jrc.ec.europa.eu/api/PVcalc?lat=${config.coordinates.latitude}&lon=${config.coordinates.longitude}&peakpower=${config.maxInstallationPower ?? 1}&loss=${config.systemLosses ?? 0.14}&outputformat=json`
  );
  const data = (await response.json()) as Response;

  return data.outputs.monthly.fixed.map((item) => item.E_d / 24);
}

type Response = {
  outputs: {
    monthly: {
      fixed: {
        month: number;
        E_d: number;
      }[];
    };
  };
};
