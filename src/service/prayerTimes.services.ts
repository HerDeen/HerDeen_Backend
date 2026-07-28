import { Types } from "mongoose";
import { prayerSettingModel } from "../models/prayerSettings.model";
import { newCustomError } from "../middleware/errorHandler";
import { Coordinates, PrayerTimes } from "adhan";
import { getCalculationParameters } from "../utils/adhan/calculationMethod";
import { getMadhab } from "../utils/adhan/madhab";
import { formatPrayerTime } from "../utils/adhan/prayerTimesFormat";
import { PrayerCalculationSettings } from "../interface/prayerCalculation";
import { prayerReminderQueue } from "../config/db.connection";
import { tryCatch } from "bullmq";
import { userModel } from "../models/users.model";

export class PrayerTimeService {
  static getPrayerTimes = async (userId: Types.ObjectId) => {
    const settings = await this.getPrayerSetting(userId);
    return this.getFormattedPrayerTimes(settings);
  };

  static getPrayerSetting = async (
    userId: Types.ObjectId,
  ): Promise<PrayerCalculationSettings> => {
    const settings = await prayerSettingModel.findOne({ userId });
    if (!settings) throw newCustomError("User not found", 404);
    if (
      settings.latitude == null ||
      settings.longitude == null ||
      !settings.timezone
    ) {
      throw newCustomError("Location not configured", 400);
    }
    return {
      latitude: settings.latitude,
      longitude: settings.longitude,
      timezone: settings.timezone,
      madhab: settings.madhab,
      calculationMethod: settings.calculationMethod,
      minutesBefore: settings.minutesBefore,
    };
  };

  static calculatePrayerTime = async (settings: PrayerCalculationSettings) => {
    const coordinate = new Coordinates(settings.latitude, settings.longitude);
    const params = getCalculationParameters(settings.calculationMethod);
    params.madhab = getMadhab(settings.madhab);
    const today = new Date();

    const prayerTimes = new PrayerTimes(coordinate, today, params);
    return {
      date: today,
      timezone: settings.timezone,
      prayerTimes,
    };
  };

  static getFormattedPrayerTimes = async (
    settings: PrayerCalculationSettings,
  ) => {
    const prayerTimes = await this.calculatePrayerTime(settings);
    // const prayerTimes = new PrayerTimes(coordinate, today, params);
    return {
      date: prayerTimes.date.toISOString().split("T")[0],
      timezone: prayerTimes.timezone,
      prayers: {
        fajr: formatPrayerTime(prayerTimes.prayerTimes.fajr, settings.timezone),
        sunrise: formatPrayerTime(
          prayerTimes.prayerTimes.sunrise,
          settings.timezone,
        ),
        dhuhr: formatPrayerTime(
          prayerTimes.prayerTimes.dhuhr,
          settings.timezone,
        ),
        asr: formatPrayerTime(prayerTimes.prayerTimes.asr, settings.timezone),
        maghrib: formatPrayerTime(
          prayerTimes.prayerTimes.maghrib,
          settings.timezone,
        ),
        isha: formatPrayerTime(prayerTimes.prayerTimes.isha, settings.timezone),
      },
    };
  };
  //TEST FOR PRAYER REMINDER
  // static prayerReminder = async (userId: Types.ObjectId) => {
  //   try {
  //     const prayer = await userModel.findOne({ _id: userId });
  //     await prayerReminderQueue.add(
  //       "prayer-reminder-queue",
  //       { userId },
  //       {
  //         attempts: 1,
  //         backoff: { type: "exponential", delay: 5000 },
  //         removeOnComplete: true,
  //       },
  //     );
  //     return prayer;
  //   } catch (err) {
  //     throw err;
  //   }
  // };
}
