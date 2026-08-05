import { Types } from "mongoose";
import { adminModel } from "../models/admins.model";
import {
  IDailySpiritualContent,
  IUpdateDailySpiritualContent,
} from "../interface/dailyConeten.interface";
import { newCustomError } from "../middleware/errorHandler";
import { getToday } from "../utils/date.utils.ts";
import { dailyContentModel } from "../models/dailyContent.model";
import {
  createDailyContentValidation,
  updateDailyContentValidation,
} from "../validation/dailyContent.validdation";

export class DailySpiritualService {
  static createContent = async (data: IDailySpiritualContent) => {
    // const admin = await adminModel.findOne({_id:adminId})
    const { error } = createDailyContentValidation.validate(data);
    if (error) throw newCustomError(error.details[0].message, 400);
    const isTitleExist = await dailyContentModel.findOne({ title: data.title });
    if (isTitleExist) throw newCustomError("Title already exist", 409);
    const create = await dailyContentModel.create(data);
    if (!create) throw newCustomError("Unable to create content", 500);
    return create;
  };
  static updateContent = async (
    contentId: Types.ObjectId,
    update: IUpdateDailySpiritualContent,
  ) => {
    const { error } = updateDailyContentValidation.validate(update);
    if (error) throw newCustomError(error.details[0].message, 400);
    const content = await dailyContentModel.findOneAndUpdate(
      contentId,
      { $set: update },
      { new: true },
    );
    if (!content) throw newCustomError("Unable to update content", 404);
    return content;
  };
  static deleteContent = async (contentId: Types.ObjectId) => {
    const content = await dailyContentModel.findByIdAndDelete(contentId);
    if (!content) throw newCustomError("No content with such Id", 404);
    return "content deleted";
  };
  static getTodayContent = async () => {
    const contents = await dailyContentModel
      .find({ active: true })
      .sort({ createdAt: 1 });
    // console.log("first", contents);
    if (contents.length === 0)
      throw newCustomError("No spiritual content available", 404);
    const today = getToday();
    const startOfTheYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfTheYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const index = dayOfYear % contents.length;
    console.log("Day of year:", dayOfYear);
    console.log("Index:", index);
    console.log("Title:", contents[index].title);
    return {
      contents: contents[index],
    };
  };
}
