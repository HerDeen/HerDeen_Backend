import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { MenstrualLogService } from "../service/menstrualCycle.services";

export class MenstrualLogController {
  static ceateMenstrualLog = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const userId = req.user.id;
      const { data } = req.body;
      const response = await MenstrualLogService.createMenstrualLog(
        userId,
        data,
      );
      res.status(200).json({ success: true, payload: response });
    },
  );
  static updateMentsrual = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const userId = req.user.id;
      const { update } = req.body;
      const response = await MenstrualLogService.updateMenstrual(
        userId,
        update,
      );
      res.status(200).json({ success: true, payload: response });
    },
  );
  static getMenstrualLog = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const userId = req.user.id;
      const response = await MenstrualLogService.getMenstrualLog(userId);
      res.status(200).json({ success: true, payload: response });
    },
  );
}
