import { Madhab } from "adhan";

const madhabMap = {
  Hanafi: Madhab.Hanafi,
  Shafi: Madhab.Shafi,
};

export function getMadhab(madhab: keyof typeof madhabMap) {
  const madhabParam = madhabMap[madhab];
  return madhabParam;
}
