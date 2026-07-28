import { Types } from "mongoose";

export interface IUpdatePrayerSettings {
  remindersEnabled?: boolean;
  reminderBefore?: number; // Minutes before prayer
  latitude?: number;
  longitude?: number;
  timezone?: string;
  calculationMethod?: string;
  madhab?: string;
}
