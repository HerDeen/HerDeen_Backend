import { CalculationMethod, CalculationParameters } from "adhan";
import { newCustomError } from "../../middleware/errorHandler";

const CalculationMethodMap = {
  MuslimWorldLeague: CalculationMethod.MuslimWorldLeague(),
  Egyptian: CalculationMethod.Egyptian(),
  Karachi: CalculationMethod.Karachi(),
  UmmAlQura: CalculationMethod.UmmAlQura(),
};

export function getCalculationParameters(
  method: keyof typeof CalculationMethodMap,
) {
  const params = CalculationMethodMap[method];
  return params;
}
