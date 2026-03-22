import dotenv from "dotenv";
dotenv.config({ quiet: true });
import mongoose from "mongoose";
import { Job, Worker } from "bullmq";
import { dailyPlanModel } from "../models/dailyPlan.model";
import { newCustomError } from "../middleware/errorHandler";
import { userModel } from "../models/users.model";
import { AiPlan } from "./openRouterAi";
import { createRedisConnection } from "../config/redis.config";
import { text } from "node:stream/consumers";

mongoose.connect(process.env.DB_CONNECTION_URI as string);

const worker = new Worker(
  "daily-plan-queue",
  async (Job) => {
    const { dailyPlanId } = Job.data;
    const plan = await dailyPlanModel.findById(dailyPlanId);
    if (!plan) throw newCustomError("No plan found", 404);

    const user = await userModel.findById(plan.userId);
    if (!user) throw newCustomError("No user found", 404);
    const inputSnapshot = {
      userId: user._id,
      date: Date.now(),
      name: user.firstName,
      lifeStage: user.lifeStage,
      deenGoals: user.deenGoals,
      preferences: user.preferences,
      timezone: user.timezone,
      userInputs: plan.userInputs,
    };

    const formattedInputs = {
      tasks: plan.userInputs.tasks.map((title: string, i: number) => ({
        id: String(i + 1),
        title,
      })),
      priorities: plan.userInputs.priorities,
      spiritualFocus: plan.userInputs.spiritualFocus,
      notes: plan.userInputs.notes,
    };

    const inputs = plan.userInputs === null ? undefined : plan.userInputs;
    if (!inputs) throw newCustomError("", 422);
    const { response, tokens } = await AiPlan.dailyPlan(user._id, inputs);
    if (!response) throw newCustomError("Unable to generate plan", 422);
    console.log("AI raw response:", JSON.stringify(response));
    // let structuredPlan;

    // try {
    //   structuredPlan = response ? JSON.parse(response) : null;
    // } catch {
    //   throw newCustomError("AI returned invalid JSON", 422);
    //   structuredPlan = { raw: response };
    // }
    plan.rawAiOutput = response;
    plan.generatedPlan = {
      text: response,
    };
    plan.status = "completed";

    await plan.save();
  },
  {
    connection: createRedisConnection(),
  },
);

worker.on("completed", (job) => {
  console.log(`Plan generated for user: ${job.data.dailyPlanId}`);
});

worker.on("failed", (job, err) => {
  console.error("Daily plan generation failed", err);
});
