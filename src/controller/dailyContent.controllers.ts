import { Request, Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { DailySpiritualService } from "../service/dailyContent.services";
import { Types } from "mongoose";

export class DailySpiritualController {
  static createContent = asyncWrapper(async (req: Request, res: Response) => {
    const { data } = req.body;
    const response = await DailySpiritualService.createContent(data);
    res.status(200).json({ success: true, payload: response });
  });

  static updateContent = asyncWrapper(async (req: Request, res: Response) => {
    const contentId = req.params.contentId;
    // const objectId = new Types.ObjectId(contentId);
    const { update } = req.body;
    const response = await DailySpiritualService.updateContent(
      contentId,
      update,
    );
    res.status(200).json({ success: true, payload: response });
  });
  static deleteContent = asyncWrapper(async (req: Request, res: Response) => {
    const contentId = req.params.contentId;
    // const objectId = new Types.ObjectId(contentId);
    const response = await DailySpiritualService.deleteContent(contentId);
    res.status(200).json({ success: true, payload: response });
  });
  static getTodayContent = asyncWrapper(async (req: Request, res: Response) => {
    const response = await DailySpiritualService.getTodayContent();
    res.status(200).json({ success: true, payload: response });
  });
}
