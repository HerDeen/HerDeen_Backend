// models/DailyPlan.ts
import mongoose, { Types, Document } from "mongoose";

export interface Task {
  id: string;
  title: string;
  description?: string;
  time?: string; // e.g., "08:00"
  completed?: boolean;
}

export interface UserInputs {
  tasks?: string[];
  priorities?: string[];
  spiritualFocus?: string[];
  notes?: string;
}

export interface IDailyPlan {
  userId: Types.ObjectId;
  date: Date;
  userInputs: UserInputs;
  generatedPlan?: any;
  status: "pending" | "generating" | "completed" | "failed";
  completedTasks?: string[];
  reflection?: string;
  generationMeta?: {
    model?: string;
    tokensUsed?: number;
    latencyMs?: number;
  };
}

export interface DailyPlanInput {
  name?: string;
  gender?: string;
  lifeStage: string;
  deenGoals: string[];
  location?: {
    city?: string;
    country?: string;
  };
  userInputs?: {
    tasks?: string[];
    priorities?: string[];
    spiritualFocus?: string[];
    notes?: string;
  };
}
