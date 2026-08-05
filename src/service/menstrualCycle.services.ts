import { TypeExpressionOperator, Types } from "mongoose";
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
import { formatDate, getToday, startOfDay } from "../utils/date.utils.ts";

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

  static isCuurentlyInFlow = async (userId: Types.ObjectId) => {
    const today = startOfDay(new Date());
    const isLog = await this.getMenstrualLog(userId);
    if (!isLog) {
      throw newCustomError("No User Log found", 404);
    }

    const flowStartDate = startOfDay(new Date(isLog.lastFlowDate));
    const flowEndDate = new Date(flowStartDate);
    flowEndDate.setDate(flowEndDate.getDate() + isLog.averageFlowDuration);
    const isInFlow = today >= flowStartDate && today < flowEndDate;
    return {
      isInFlow,
      flowStartDate,
      flowEndDate,
    };
  };

  static getCurrentMenstrualStatus = async (userId: Types.ObjectId) => {
    const status = await this.isCuurentlyInFlow(userId);
    if (!status.isInFlow) {
      return {
        isInflow: false,
        flowStartDate: status.flowStartDate,
        flowEndDate: status.flowEndDate,
        currentDay: 0,
        daysRemaining: 0,
      };
    }
    const start = startOfDay(status.flowStartDate);
    const end = startOfDay(status.flowEndDate);
    const today = startOfDay(new Date());
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const currentDay =
      Math.floor((today.getTime() - start.getTime()) / MS_PER_DAY) + 1;
    const log = await this.getMenstrualLog(userId);
    const daysRemaining = Math.max(log.averageFlowDuration - currentDay);

    return {
      isInFlow: true,
      flowStartDate: formatDate(start),
      flowEndDate: formatDate(end),
      currentDay,
      daysRemaining,
    };
  };
}
