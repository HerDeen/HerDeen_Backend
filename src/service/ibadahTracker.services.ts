import { Types } from "mongoose";
import { ibadahTrackerModel } from "../models/ibadahTracker";
import { newCustomError } from "../middleware/errorHandler";
import { IIbadahTracker } from "../interface/prayer.interface";
import { ibadahTrackerValidation } from "../validation/ibdadahTracker";
import { getToday } from "../utils/date.utils.ts";
import { MenstrualLogService } from "./menstrualCycle.services";

export class IbadahTrackerService {
  static getTodayTracker = async (userId: Types.ObjectId) => {
    const today = getToday();
    const tracker = await ibadahTrackerModel.findOne({ userId, date: today });
    const MenstrualStatus =
      await MenstrualLogService.getCurrentMenstrualStatus(userId);
    if (tracker) {
      return {
        tracker: tracker,
        MenstrualStatus,
      };
    }
    const createTracker = await ibadahTrackerModel.create({
      userId,
      date: today,
    });
    return { createTracker, MenstrualStatus };
  };
  static togglePrayer = async (
    userId: Types.ObjectId,
    prayer: keyof IIbadahTracker["salah"],
    completed: boolean,
  ) => {
    const { error } = ibadahTrackerValidation.validate(prayer);
    if (error) {
      throw newCustomError(error.message, 400);
    }
    const updatePrayer = await this.getTodayTracker(userId);
    updatePrayer.tracker?.salah!;
    updatePrayer.tracker!.salah![prayer] = completed;

    await updatePrayer.tracker?.save();
    return updatePrayer.tracker?.salah;
  };
  static updateQuranPages = async (
    userId: Types.ObjectId,
    pagesRead: number,
  ) => {
    const tracker = await this.getTodayTracker(userId);

    if (!tracker.tracker?.quran)
      throw newCustomError("Quran tracker not found", 404);
    tracker.tracker.quran.pagesRead = pagesRead;
    await tracker.tracker.save();
    return {
      quran: tracker.tracker.quran,
    };
  };

  static toggleAdhkaar = async (userId: Types.ObjectId, completed: boolean) => {
    const tracker = await this.getTodayTracker(userId);
    // if(!tracker.adhkaar)
    tracker.tracker!.adhkaar = completed;
    await tracker?.tracker?.save();
    return {
      adhkaaar: tracker.tracker?.adhkaar,
    };
  };
}
