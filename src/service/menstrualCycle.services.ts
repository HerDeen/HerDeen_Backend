import { Types } from "mongoose";
import {
  IMenstrualLog,
  IUpdateMenstrualLog,
} from "../interface/menstrualInterfae";
import { menstrualLogModel } from "../models/menstrualCycle";
import { newCustomError } from "../middleware/errorHandler";
import {
  createMenstrualLogValidation,
  updateMenstrualLogValidation,
} from "../validation/menstrualLog.validation";

export class MenstrualLogService {
  static createMenstrualLog = async (
    userId: Types.ObjectId,
    data: IMenstrualLog,
  ) => {
    const { error } = createMenstrualLogValidation.validate(data);
    if (error) {
      throw newCustomError(error.message, 400);
    }
    const menstrualLog = await menstrualLogModel.findOne({ userId });
    if (menstrualLog) {
      return menstrualLog;
    }
    return await menstrualLogModel.create({
      ...data,
      userId,
    });
  };

  static updateMenstrual = async (
    userId: Types.ObjectId,
    update: IUpdateMenstrualLog,
  ) => {
    const { error } = updateMenstrualLogValidation.validate(update);
    if (error) {
      throw newCustomError(error.message, 400);
    }
    // console.log("mens", mens);
    const menstrual = await menstrualLogModel.findOneAndUpdate(
      { userId },
      { $set: update },
      { new: true },
    );
    // console.log("menstrual", menstrual);
    if (!menstrual) throw newCustomError("Unable to Update", 404);
    return menstrual;
  };

  static getMenstrualLog = async (userId: Types.ObjectId) => {
    const getLog = await menstrualLogModel
      .findOne({ userId })
      .select("-__v -_id -userId");
    if (!getLog) throw newCustomError("No Menstrual Log", 404);
    return getLog;
  };
}
