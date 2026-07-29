import mongoose, { Schema, Types } from "mongoose";

const menstrualLogSchema = new Schema(
  {
    userId: { type: Types.ObjectId, requied: true, ref: "User", unique: true },
    lastFlowDate: { type: Date, required: true },
    averageFlowDuration: { type: Number, default: 7 },
    cycleLength: { type: Number, default: 21 },
    useStandardCycle: { type: Boolean, deafault: false },
    quranGoalDuringPeriod: { type: Number, default: 0 },
    memorizationFrequency: {
      type: String,
      enum: ["daily", "weekly", "occasionally"],
      default: "daily",
    },
    reminderPreference: {
      type: {
        spiritualEncouragement: Boolean,
        restReminder: Boolean,
        disableIbadahReminders: Boolean,
      },
    },
  },
  {
    timestamps: true,
  },
);

export const menstrualLogModel = mongoose.model(
  "Menstrual-Cycle-Log",
  menstrualLogSchema,
);
