import mongoose from "mongoose";
import { dburi } from "./system.variable";
import { AdminService } from "../service/admin.services";
import { Queue } from "bullmq";
import { createRedisConnection } from "./redis.config";

export const mongoConnection = async () => {
  try {
    await mongoose.connect(`${dburi}`);
    console.log("database connected");
    AdminService.superAdmin();
  } catch (error) {
    console.log("database disconnected");
  }
};
export const dailyPlanQueue = new Queue("daily-plan-queue", {
  connection: createRedisConnection(),
});

export const prayerReminderQueue = new Queue("prayer-reminder-queue", {
  connection: createRedisConnection(),
});
