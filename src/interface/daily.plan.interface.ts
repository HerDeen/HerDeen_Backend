// models/DailyPlan.ts
import mongoose, { Types } from "mongoose";

// export interface subTask {
//   id: string;
//   title: string;
//   description?: string | null;
//   time?: string | null; // e.g., "08:00"
//   completed?: boolean;
// }

export interface Task {
  title: string;
  description?: string | null;
  time?: string | null; // e.g., "08:00"
  completed?: boolean;
}

// export interface TaskWithId extends Omit<Task, "subtasks"> {
//   _id: mongoose.Types.ObjectId;
//   subTask?: TaskWithId[] | undefined;
// }

export interface UserInputs {
  tasks: string[];
  priorities: string[];
  spiritualFocus: string[];
  notes: string;
}

export interface IDailyPlan {
  userId: Types.ObjectId;
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
    tasks?: Task[];
    priorities?: string[];
    spiritualFocus?: string[];
    notes?: string;
  };
}
