import { Response } from "express";
import { IRequest } from "../middleware/authMiddleware";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { PrayerSettingService } from "../service/prayerSettings.services";

export class PrayerSettingController {
  static updatePrayerSetting = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const userId = req.user.id;
      const { data } = req.body;
      const response = await PrayerSettingService.updatePrayerSetting(
        userId,
        data,
      );
      res.status(200).json({ success: true, payload: response });
    },
  );
}
