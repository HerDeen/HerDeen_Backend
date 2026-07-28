import dotenv from "dotenv";
dotenv.config({ quiet: true });
import mongoose, { Types } from "mongoose";
import { Job, Worker } from "bullmq";
import { dailyPlanModel } from "../models/dailyPlan.model";
import { newCustomError } from "../middleware/errorHandler";
import { userModel } from "../models/users.model";
import { AiPlan } from "./openRouterAi";
import { createRedisConnection, redis } from "../config/redis.config";
import { text } from "node:stream/consumers";
import crypto from "crypto";
import moment from "moment-timezone";
import { PrayerTimeService } from "../service/prayerTimes.services";
import { prayerSettingModel } from "../models/prayerSettings.model";
import { getDuePrayerTime } from "./adhan/prayerTimesFormat";
import { NotificationService } from "../service/notifications.services";
import "../utils/adhan/prayerReminder-cron";
import { error } from "node:console";

mongoose.connect(process.env.DB_CONNECTION_URI as string);

//daily plan worker
const worker = new Worker(
  "daily-plan-queue",
  async (Job) => {
    const { dailyPlanId } = Job.data;
    const plan = await dailyPlanModel.findById(dailyPlanId);
    if (!plan) throw newCustomError("No plan found", 404);

    const user = await userModel.findById(plan.userId);
    if (!user) throw newCustomError("No user found", 404);

    const inputs = (plan.userInputs?.tasks ?? []).map((t: any) => {
      if (typeof t === "string") {
        return {
          title: t,
          completed: false,
          description: null,
          time: null,
          subTask: t,
        };
      }

      return {
        // id: t.id,
        title: t.title,
        completed: t.completed ?? false,
        description: t.description ?? null,
        time: t.time ?? null,
        subTask: t.subTask,
      };
    });
    if (!inputs.length) throw newCustomError("inputs are empty", 422);

    const timezone = user.timezone || "UTC";
    const getUserToday = (timezone: string) => {
      return moment().tz(timezone).format("YYYY-MM-DD");
    };
    const today = getUserToday(timezone);

    const normalizedInputs = {
      tasks: inputs,
      priorities: plan.userInputs?.priorities,
      spiritualFocus: plan.userInputs?.spiritualFocus,
      notes: plan.userInputs?.notes,
    };

    //generate hash key
    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(normalizedInputs))
      .digest("hex");
    const cacheKey = `globalPlan:${today}:${hash}`;
    const cached = await redis.get(cacheKey);
    const parsedCached = cached ? JSON.stringify(cached) : null;

    //hit cached for similar plan
    if (cached) {
      const update = await dailyPlanModel.findOneAndUpdate(
        { userId: user._id },
        {
          $set: {
            date: today,
            status: "completed",
            generatedPlan: { text: cached },
          },
        },
        { new: true },
      );
      if (!update) throw newCustomError("unable to update", 422);
    } else {
      const { tasks, tokens } = await AiPlan.dailyPlan(
        user._id,
        normalizedInputs,
      );
      if (!tasks || !Array.isArray(tasks) || tasks.length === 0)
        throw newCustomError("Unable to generate plan", 422);
      //cached plan
      const cachedAiPlan = await redis.set(cacheKey, JSON.stringify(tasks), {
        ex: 86400,
      });
      //upate Ai response
      // console.log("first", tasks);
      const newPlan = await dailyPlanModel.findOneAndUpdate(
        {
          userId: user._id,
        },

        {
          $set: {
            rawAiOutput: JSON.stringify(tasks),
            generatedPlan: tasks,
            status: "completed",
          },
        },
        { new: true, upsert: true },
      );
      return newPlan;
    }
  },
  {
    connection: createRedisConnection(),
  },
);

worker.on("completed", (job) => {
  console.log(`Plan generated for: ${job.data.dailyPlanId}`);
});

worker.on("failed", (job, err) => {
  console.error("Daily plan generation failed", err);
});

//prayer Reminder worker
console.log("Prayer Reminder started");
const prayerReminderWorker = new Worker(
  "prayer-reminder-queue",
  async (Job) => {
    const { userId } = Job.data;
    const user = await userModel.findOne({ _id: userId });
    if (!user) throw newCustomError("No user found", 404);
    //chek user FCM token
    // if (!user?.fcmToken?.trim()) {
    //   console.log(`No fcmToken for user ${userId}`);
    //   return;
    // }
    const settings = await PrayerTimeService.getPrayerSetting(userId);
    const currentTime = new Date();
    const result = await PrayerTimeService.calculatePrayerTime(settings);
    const duePrayerTimes = getDuePrayerTime(
      result.prayerTimes,
      settings.minutesBefore,
      currentTime,
    );
    if (!duePrayerTimes) return;
    const date = currentTime.toISOString().split("T")[0];
    //create redis key
    const key = `prayer-reminder:${userId}:${duePrayerTimes.prayer}:${date}`;
    const alreadySent = await redis.get(key);
    if (alreadySent) {
      console.log("Reminder sent already");
      return;
    } //send Notification though FCM
    try {
      await NotificationService.sendPushNotication(
        user.fcmToken!,
        `${duePrayerTimes.prayer} Reminder`,
        `${duePrayerTimes.prayer} is in ${settings.minutesBefore}`,
      );
      console.log(`sent ${duePrayerTimes.prayer} Reminder for user ${userId}`);
      //Save key to redis to avoid dedupklication
      // await redis.set(key, "sent", { ex: 86400 });
      const value = await redis.get(key);

      console.log(key, value);
    } catch (error) {
      console.error("FCM send failed", error);
    }
  },
  {
    connection: createRedisConnection(),
  },
);

prayerReminderWorker.on("completed", (job) => {
  console.log(`prayer reminder job finished for user: ${job.data.userId}`);
});
prayerReminderWorker.on("failed", (job, err) => {
  console.error(`Reminder failed`, err);
});
