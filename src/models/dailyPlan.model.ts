import mongoose, { Schema, Types } from "mongoose";
import { IDailyPlan, Task } from "../interface/daily.plan.interface";

// const TaskSchema = new Schema({
//   id: { type: String, required: true }, // unique per task
//   title: { type: String, required: true },
//   description: { type: String },
//   time: { type: String }, // e.g., "08:00"
//   completed: { type: Boolean, default: false },
// });

// const SubTaskSchema = new Schema({
//   id: { type: String, required: true },
//   title: { type: String, required: true },
//   completed: { type: Boolean, default: false },
//   description: String,
//   time: String,
// });

// const TaskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, default: null },
//   time: { type: String, default: null },
//   completed: { type: Boolean, default: false },
// });

const dailyPlanSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, ref: "User" },
    date: { type: String, required: true },
    timezone: { type: String, required: false },
    userInputs: {
      tasks: [{ type: String, default: [] }],
      priorities: [{ type: String, default: [] }],
      spiritualFocus: [{ type: String, default: [] }],
      notes: { type: String, default: "" },
    },

    generatedPlan: [
      {
        title: String,
        description: String,
        time: String,
        completed: { type: Boolean, default: false },
      },
    ],
    rawAiOutput: {
      type: String,
    },

    status: {
      type: String,
      enum: ["generating", "completed", "failed"],
      default: "generating",
    },

    completedTasks: [{ type: String }], // task ids or labels

    reflection: { type: String },

    generationMeta: {
      model: { type: String },
      tokensUsed: { type: Number },
      latencyMs: { type: Number },
    },
  },
  {
    timestamps: true,
  },
);

// Enforce one plan per user per day
dailyPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

export const dailyPlanModel = mongoose.model("Daily-Plan", dailyPlanSchema);
