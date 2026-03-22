import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { DailyPlanServives } from "../service/dailyPlan.services";

export class DailyPlanController {
  static myDailyPlan = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const plan = req.body;
    const response = await DailyPlanServives.myPlan(userId, plan);
    res.status(201).json({ success: true, payload: response });
  });
}
