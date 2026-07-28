import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { PrayerTimeService } from "../service/prayerTimes.services";

export class PrayerTimesController {
  static prayerTimes = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const response = await PrayerTimeService.getPrayerTimes(userId);
    res.status(200).json({ success: true, payload: response });
  });
  // TEST for PRAYER REMINDER
  // static prayerReminder = asyncWrapper(async (req: IRequest, res: Response) => {
  //   const userId = req.user.id;
  //   const response = await PrayerTimeService.prayerReminder(userId);
  //   res.status(200).json({ success: true, payload: response });
  // });
}
