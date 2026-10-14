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
  editTaskValidator,
  planDateValidate,
  taskIdValidator,
  taskValidator,
} from "../validation/plan.validate";

import { any } from "joi";
import { getTasks } from "node-cron";
import { assignIds } from "../utils/crypto";
import { isValidDate } from "../utils/date.utils.ts";

export class DailyPlanServices {
  static myPlan = async (userId: Types.ObjectId, plan: IDailyPlan) => {
    const user = await userModel.findById(userId);
    if (!user) throw newCustomError("No user Found", 404);
    if (!user.lifeStage) {
      throw newCustomError("Please select your life stage", 422);
    }

    if (user.lifeStage === null) {
      throw newCustomError("Please select your current life Stage", 422);
    }

    if (!user.deenGoals || user.deenGoals.length === 0) {
      throw newCustomError("Please select at least one Deen goal", 422);
    }

    // const normalizedTasks = (plan.userInputs?.tasks ?? []).map((t: any) => {
    //   if (typeof t === "string") {
    //     return {
    //       title: t,
    //       completed: false,
    //       description: null,
    //       time: null,
    //     };
    //   }

    //   return {
    //     title: t.title,
    //     completed: t.completed ?? false,
    //     description: t.description ?? null,
    //     time: t.time ?? null,
    //   };
    // });

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

    const today = getUserToday(timezone);
    try {
      const newPlan = await dailyPlanModel.create({
        userId,
        date: today,
        userInputs: safeUserInputs,
        status: "generating",
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
      return newPlan;
    } catch (err) {
      throw err;
    }
  };

  static getPlan = async (userId: Types.ObjectId, date: string) => {
    if (!isValidDate(date)) {
      throw newCustomError("Invalid date. Use YYYY-MM-DD.", 400);
    }
    const plan = await dailyPlanModel
      .findOne({ userId, date })
      .select("-_id -userId -rawAiOutput -__v -userId ");
    if (!plan) throw newCustomError("No plan found", 404);
    return plan;
  };

  static getCompletedTasks = async (userId: Types.ObjectId, date: string) => {
    if (!isValidDate(date)) {
      throw newCustomError("Invalid date. Use YYYY-MM-DD.", 400);
    }
    const task = await dailyPlanModel.findOne({ userId, date });
    if (!task) return "No task found";
    const tasks = task.completedTasks;
    if (tasks.length === 0) {
      return [];
    }
    const completedTasks = tasks
      .map((id: any) => {
        const item = task.generatedPlan.find(
          (t: any) => t._id.toString() === id,
        );

        return item ? { id, title: item.title } : null;
      })
      .filter(Boolean);
    return completedTasks;
  };
  static planHistory = async (userId: Types.ObjectId) => {
    const plan = await dailyPlanModel.find({ userId }, { createdAt: 1 });
    if (plan.length === 0) throw newCustomError("No plan found", 404);
    return plan;
  };

  static taskCompleted = async (
    userId: Types.ObjectId,
    date: string,
    taskId: string,
  ) => {
    if (!isValidDate(date)) {
      throw newCustomError("Invalid date. Use YYYY-MM-DD.", 400);
    }
    if (!isValidObjectId(taskId)) throw newCustomError("Invalid Id", 404);
    const tasks = await dailyPlanModel.findOne({ userId, date });
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
    date: string,
    taskId: string,
    update: {
      description: string;
      time: string;
      title: string;
    },
  ) => {
    if (!isValidDate(date)) {
      throw newCustomError("Invalid date. Use YYYY-MM-DD.", 400);
    }
    const { value, error } = editTaskValidator.validate({ taskId, update });
    if (error) throw newCustomError(error.message, 400);
    const ObjectId = new mongoose.Types.ObjectId(taskId);
    if (!isValidObjectId(ObjectId)) throw newCustomError("Invalid Id", 401);
    const tasks = await dailyPlanModel.findOne({ userId, date });
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

  static addTask = async (userId: Types.ObjectId, task: Task, date: string) => {
    if (!isValidDate(date)) {
      throw newCustomError("Invalid date. Use YYYY-MM-DD.", 400);
    }
    const { value, error } = taskValidator.validate(task);
    if (error) throw newCustomError(error.message, 400);
    const tasks = await dailyPlanModel.findOne({ userId, date });
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

  static removeTask = async (
    userId: Types.ObjectId,
    date: string,
    taskId: string,
  ) => {
    if (!isValidDate(date)) {
      throw newCustomError("Invalid date. Use YYYY-MM-DD.", 400);
    }
    const { value, error } = taskIdValidator.validate(taskId);
    // console.log("first", value);
    if (error) throw newCustomError(error.message, 400);
    const objectId = new mongoose.Types.ObjectId(value);
    // console.log("sec", objectId);
    const taskDoc = await dailyPlanModel.findOne(
      { userId, date, "generatedPlan._id": objectId },
      { "generatedPlan.$": 1 },
    );
    if (!taskDoc) throw newCustomError("No Task Found", 404);
    const title = taskDoc?.generatedPlan?.[0]?.title;
    const task = await dailyPlanModel.updateOne(
      { userId },
      { $pull: { generatedPlan: { _id: objectId } } },
    );
    return `Task '${title}' has been removed successfully`;
  };
}
