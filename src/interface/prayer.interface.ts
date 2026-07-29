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

export interface IIbadahTracker {
  salah: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  quran: {
    pagesRead: number;
  };

  adhkaar: {
    completed: boolean;
  };
}
