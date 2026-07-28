import { Types } from "mongoose";
import { IUpdatePrayerSettings } from "../interface/prayer.interface";
import { userModel } from "../models/users.model";
import { prayerSettingModel } from "../models/prayerSettings.model";
import { newCustomError } from "../middleware/errorHandler";
import { object } from "joi";
import { validatePrayerSettings } from "../validation/prayerSettings.validate";

export class PrayerSettingService {
  static updatePrayerSetting = async (
    userId: Types.ObjectId,
    data: IUpdatePrayerSettings,
  ) => {
    const { error, value } = validatePrayerSettings.validate(data);
    if (error) throw newCustomError(error.details[0].message, 400);
    if (value.timezone) {
      try {
        Intl.DateTimeFormat("en-NG", { timeZone: value.timezone });
      } catch (error) {
        throw newCustomError("Invalid timezone", 400);
      }
    }
    const settingExist = await prayerSettingModel.findOne({ userId });
    const merged = {
      ...(settingExist?.toObject() || {}),
      ...value,
    };

    if (
      merged.remindersEnabled &&
      (merged.latitude === undefined ||
        merged.longitude === undefined ||
        !merged.timezone)
    ) {
      throw newCustomError(
        "Location is required before enabling prayer reminders.",
        400,
      );
    }
    const user = await prayerSettingModel.findByIdAndUpdate(
      userId,
      {
        $set: value,
        $setOnInsert: { userId },
      },
      { upsert: true, new: true, runValidators: true },
    );
    if (!user) throw newCustomError("No record found", 404);
    return "Settings updated";
  };
}
