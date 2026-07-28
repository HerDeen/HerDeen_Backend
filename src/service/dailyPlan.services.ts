import mongoose, { isValidObjectId, Types } from "mongoose";
import { AiPlan } from "../utils/openRouterAi";
import crypto, { hash } from "crypto";
import { userModel } from "../models/users.model";
import { newCustomError } from "../middleware/errorHandler";
import { dailyPlanModel } from "../models/dailyPlan.model";
import { IDailyPlan, Task } from "../interface/daily.plan.interface";
import { dailyPlanQueue } from "../config/db.connection";
import moment from "moment-timezone";
import { tryCatch } from "bullmq";
import {
  planDateValidate,
  taskIdValidator,
  taskValidator,
} from "../validation/plan.validate";
import { updateValidator } from "../validation/plan.validate";
import { any } from "joi";
import { getTasks } from "node-cron";
import { assignIds } from "../utils/crypto";

export class DailyPlanServices {
  static myPlan = async (userId: Types.ObjectId, plan: IDailyPlan) => {
    const user = await userModel.findById(userId);
    if (!user) throw newCustomError("No user Found", 404);
    if (!user.lifeStage) {
      throw newCustomError("Please select your life stage", 422);
    }

    if (user.lifeStage === null)
      throw newCustomError("Please select your current life Stage", 422);

    if (!user.deenGoals || user.deenGoals.length === 0) {
      throw newCustomError("Please select at least one Deen goal", 422);
    }

    const normalizedTasks = (plan.userInputs?.tasks ?? []).map((t: any) => {
      if (typeof t === "string") {
        return {
          title: t,
          completed: false,
          description: null,
          time: null,
        };
      }

      return {
        title: t.title,
        completed: t.completed ?? false,
        description: t.description ?? null,
        time: t.time ?? null,
      };
    });

    const safeUserInputs = {
      tasks: plan.userInputs?.tasks ?? [],
      priorities: plan.userInputs?.priorities ?? [],
      spiritualFocus: plan.userInputs?.spiritualFocus ?? [],
      notes: plan.userInputs?.notes ?? "",
    };

    const timezone = user.timezone || "UTC";
    const getUserToday = (timezone: string) => {
      return moment().tz(timezone).format("YYYY-MM-DD");
    };

    // console.log("first:", safeUserInputs);
    const today = getUserToday(timezone);
    try {
      const newPlan = await dailyPlanModel.create({
        userId,
        date: today,
        userInputs: safeUserInputs,
        status: "generating",
      });

      // console.log("second", newPlan);
      await dailyPlanQueue.add(
        "daily-plan-queue",
        { dailyPlanId: newPlan._id.toString() },
        {
          attempts: 1,
          backoff: { type: "exponential", delay: 5000 },
          removeOnComplete: true,
        },
      );

      return newPlan;
    } catch (err) {
      // console.error("CREATE PLAN ERROR:", err);
      // console.error("CREATE PLAN ERROR:", err);
      throw err;
    }
  };

  static getPlan = async (userId: Types.ObjectId, date: string) => {
    const plan = await dailyPlanModel.findOne({ userId, date });
    if (!plan) throw newCustomError("No plan found", 404);
    return plan;
  };

  static getCompletedTasks = async (userId: Types.ObjectId) => {
    const task = await dailyPlanModel.findOne({ userId });
    if (!task) return null;
    const tasks = task.completedTasks;
    if (tasks.length <= 0) {
      return "You haven't completed any task";
    }
    return tasks;
  };
  static planHistory = async (userId: Types.ObjectId) => {
    const plan = await dailyPlanModel
      .find({ userId })
      .select("-rawAiOutput -__v -userId -userInputs");
    if (!plan) throw newCustomError("No plan found", 404);
    return plan;
  };

  static taskCompleted = async (userId: Types.ObjectId, taskId: string) => {
    if (!isValidObjectId(taskId)) throw newCustomError("Invalid Id", 404);
    const tasks = await dailyPlanModel.findOne({ userId });
    if (!tasks) throw newCustomError("No record found", 404);
    //get task Id
    const getTask = tasks.generatedPlan.find(
      (task: any) => task.id.toString() === taskId.toString(),
    );
    if (!getTask) throw newCustomError("task not found", 404);
    //check if task is completed
    if (getTask.completed === true)
      throw newCustomError("Task already completed", 422);
    getTask.completed = true;

    //extra check if task is already added to completed Task
    const completeTask = tasks.completedTasks.some(
      (task: any) => task === taskId,
    );
    if (completeTask) throw newCustomError("Task already added", 422);
    //add task to completed tasks
    tasks.completedTasks.push(getTask._id.toString());

    await tasks.save();
    return getTask;
  };

  static editTask = async (
    userId: Types.ObjectId,
    taskId: string,
    update: {
      description: string;
      time: string;
      title: string;
    },
  ) => {
    const { value, error } = updateValidator.validate({ taskId, update });
    if (error) throw newCustomError(error.message, 400);
    const ObjectId = new mongoose.Types.ObjectId(taskId);
    if (!isValidObjectId(ObjectId)) throw newCustomError("Invalid Id", 401);
    const tasks = await dailyPlanModel.findOne({ userId });
    if (!tasks) throw newCustomError("No record found", 404);
    const tasked = tasks?.generatedPlan.find((task: any) =>
      task._id.equals(ObjectId),
    );
    if (!tasked) throw newCustomError("No Id Found", 404);
    if (tasked) {
      ((tasked.title = value.update.title ?? tasked.title),
        (tasked.description = value.update.description ?? tasked.description),
        (tasked.time = value.update.time ?? tasked.time));
    }
    await tasks.save();

    return tasked;
  };

  static addTask = async (userId: Types.ObjectId, task: Task) => {
    const { value, error } = taskValidator.validate(task);
    if (error) throw newCustomError(error.message, 400);
    const tasks = await dailyPlanModel.findOne({ userId });
    if (!tasks) throw newCustomError("No record found", 404);
    const newTask = {
      ...value,
      id: new mongoose.Types.ObjectId(),
    };
    const taskExist = tasks.generatedPlan.find(
      (task: any) => task.title === value.title || task.time === value.time,
    );
    if (taskExist) {
      throw newCustomError("Similar task Title/Time already exist", 422);
    }
    const taskAdded = tasks.generatedPlan.push(newTask);
    // console.log("first", newTaask);
    await tasks.save();
    return newTask;
  };

  static removeTask = async (userId: Types.ObjectId, taskId: string) => {
    const { value, error } = taskIdValidator.validate(taskId);
    // console.log("first", value);
    if (error) throw newCustomError(error.message, 400);
    const objectId = new mongoose.Types.ObjectId(value);
    // console.log("sec", objectId);
    const taskDoc = await dailyPlanModel.findOne(
      { userId, "generatedPlan._id": objectId },
      { "generatedPlan.$": 1 },
    );
    if (!taskDoc) throw newCustomError("No Task Found", 404);
    const title = taskDoc?.generatedPlan?.[0]?.title;
    const task = await dailyPlanModel.updateOne(
      { userId },
      { $pull: { generatedPlan: { _id: objectId } } },
    );
    return `Task '${title}' has been removed successfully`; // const tasks = task?.generatedPlan?.find((task:any) => task.id)
  };
}
