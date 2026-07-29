import { Types } from "mongoose";
import { ibadahTrackerModel } from "../models/ibadahTracker";
import { newCustomError } from "../middleware/errorHandler";
import { IIbadahTracker } from "../interface/prayer.interface";
import { ibadahTrackerValidation } from "../validation/ibdadahTracker";
import { getToday } from "../utils/helperTodays.date";

export class IbadahTrackerService {
  static getTodayTracker = async (userId: Types.ObjectId) => {
    const today = getToday();
    const tracker = await ibadahTrackerModel.findOne({ userId, date: today });
    if (tracker) {
      return tracker;
    }
    const createTracker = await ibadahTrackerModel.create({
      userId,
      date: today,
    });
    return createTracker;
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

    updatePrayer.salah![prayer] = completed;

    await updatePrayer.save();
    return updatePrayer.salah;
  };
  static updateQuranPages = async (
    userId: Types.ObjectId,
    pagesRead: number,
  ) => {
    const tracker = await this.getTodayTracker(userId);

    if (!tracker.quran) throw newCustomError("Quran tracker not found", 404);
    tracker.quran.pagesRead = pagesRead;
    await tracker.save();
    return {
      quran: tracker.quran,
    };
  };

  static toggleAdhkaar = async (userId: Types.ObjectId, completed: boolean) => {
    const tracker = await this.getTodayTracker(userId);
    // if(!tracker.adhkaar)
    tracker.adhkaar = completed;
    await tracker.save();
    return {
      adhkaaar: tracker.adhkaar,
    };
  };
}
