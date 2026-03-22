import { Types } from "mongoose";
import { AiPlan } from "../utils/openRouterAi";
import { userModel } from "../models/users.model";
import { newCustomError } from "../middleware/errorHandler";
import { dailyPlanModel } from "../models/dailyPlan.model";
import { IDailyPlan } from "../interface/daily.plan.interface";
import { dailyPlanQueue } from "../config/db.connection";

export class DailyPlanServives {
  static myPlan = async (userId: Types.ObjectId, plan: IDailyPlan) => {
    const user = await userModel.findById(userId);
    if (!user) throw newCustomError("No user Found", 404);
    if (!user.lifeStage) {
      throw newCustomError("Please select your life stage", 422);
    }

    if (user.lifeStage === null)
      throw newCustomError("Please select ypur current life Stage", 422);

    if (!user.deenGoals || user.deenGoals.length === 0) {
      throw newCustomError("Please select at least one Deen goal", 422);
    }
    const safeUserInputs = plan.userInputs ?? {
      tasks: [],
      priorities: [],
      spiritualFocus: [],
      notes: "",
    };
    const safeDate = plan?.date ? new Date(plan.date) : null;
    if (!safeDate) throw newCustomError("Plan date is required", 422);
    const newPlan = await dailyPlanModel.create({
      userId,
      date: safeDate,
      userInputs: safeUserInputs,
      status: "pending",
    });
    await dailyPlanQueue.add(
      "daily-plan-queue",
      { dailyPlanId: newPlan._id.toString() },
      {
        attempts: 1,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: true,
      },
    );

    // const response = await AiPlan.dailyPlan(user._id);
    // if (!response) throw newCustomError("Unable to generate a plan", 500);
    return newPlan;
  };
}
