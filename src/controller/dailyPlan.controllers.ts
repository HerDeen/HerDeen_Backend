import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { DailyPlanServices } from "../service/dailyPlan.services";
import { resetCahce } from "../config/redis.config";
import { analyzeComplexity, decomposeTask } from "../service/taskIntellisence";
import mongoose from "mongoose";

export class DailyPlanController {
  static myDailyPlan = asyncWrapper(async (req: IRequest, res: Response) => {
    try {
      const userId = req.user.id;
      const plan = req.body;
      // const profile = analyzeComplexity(plan);
      // const subTask = decomposeTask(profile);
      const response = await DailyPlanServices.myPlan(userId, plan);
      res.status(201).json({ success: true, payload: response });
    } catch (err: any) {
      if (err.code === 11000) {
        res.status(429).json({
          Message:
            "Daily limit reached. you can only generate one plan per day",
        });
      }
    }
  });

  static getPlan = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const date = req.params.date;
    const response = await DailyPlanServices.getPlan(userId, date);
    res.status(200).json({ success: true, payload: response });
  });

  static getCompletedTasks = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const userId = req.user.id;
      const response = await DailyPlanServices.getCompletedTasks(userId);
      res.status(200).json({ success: true, payload: response });
    },
  );

  static planHistory = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const response = await DailyPlanServices.planHistory(userId);
    res.status(200).json({ success: true, payload: response });
  });

  static taskCompleted = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const task = req.params.task;
    const response = await DailyPlanServices.taskCompleted(userId, task);
    res.status(200).json({ success: true, payload: response });
  });
  static editTask = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const { taskId } = req.params;
    // const ObjectId = new mongoose.Types.ObjectId(taskId)
    const { update } = req.body;
    const response = await DailyPlanServices.editTask(userId, taskId, update);
    res.status(201).json({ success: true, payload: response });
  });
  static clearCahcePlan = asyncWrapper(async (req: Request, res: Response) => {
    try {
      await resetCahce("globalPlan:*");
      res
        .status(200)
        .json({ success: true, messsage: "Cache cleared manually" });
    } catch (err: any) {
      console.error(err);
    }
  });

  static addNewTask = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const task = req.body;
    const response = await DailyPlanServices.addTask(userId, task);
    res.status(200).json({ success: true, payload: response });
  });

  static removeTask = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const { taskId } = req.params;
    const response = await DailyPlanServices.removeTask(userId, taskId);
    res.status(200).json({ success: true, payload: response });
  });
}
