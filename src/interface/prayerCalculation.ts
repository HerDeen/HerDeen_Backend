export interface PrayerCalculationSettings {
  latitude: number;
  longitude: number;
  timezone: string;
  madhab: "Shafi" | "Hanafi";
  calculationMethod: "MuslimWorldLeague" | "Egyptian" | "Karachi" | "UmmAlQura";
  minutesBefore: number;
}
