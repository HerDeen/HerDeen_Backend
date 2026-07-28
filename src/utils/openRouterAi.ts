import OpenAI from "openai";
import { newCustomError } from "../middleware/errorHandler";
import { userModel } from "../models/users.model";
import { Types } from "mongoose";
import { gemini_api_key } from "../config/system.variable";
import {
  DailyPlanInput,
  IDailyPlan,
  Task,
} from "../interface/daily.plan.interface";
import { dailyPlanModel } from "../models/dailyPlan.model";
import { assignIds } from "./crypto";
import { tryCatch } from "bullmq";

const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: gemini_api_key,
});

export class AiPlan {
  static dailyPlan = async (
    userId: Types.ObjectId,
    userInputs: {
      tasks: Task[];
      priorities?: string[];
      spiritualFocus?: string[];
      notes?: string;
    },
  ) => {
    try {
      const input = await userModel.findById(userId);
      if (!input) throw newCustomError("no user found", 404);
      const dailyPlan = await dailyPlanModel.findOne({ userId });
      if (!dailyPlan) throw newCustomError("No plan found", 404);
      // const userInputs = dailyPlan.userInputs;

      const prompt = `
        You are an Islamic lifestyle and productivity assistant.


You will receive a list of structured tasks. Each task has:
- title
- completed
- description
- time (optional preferred time)

TASK LIST:
${userInputs.tasks
  .map(
    (t) => `
title: ${t.title}
completed: ${t.completed}
description: ${t.description ?? "none"}
time: ${t.time ?? "none"}
`,
  )
  .join("\n")}

RULES:
- "Given the user input, generate a plan. If any task requires subtasks, ensure those subtasks also have unique IDs and are nested within their parent task. Each task or subtask should have a unique identifier, a description, and any relevant fields, so we can later map them to a hierarchical structure."
- You MUST include EVERY task in the final schedule
- Do NOT remove or merge tasks
- Use each task's "time" as a preference, not a strict rule
- If time is missing, assign a realistic time slot
- Do not include IDs in the output.


ADDITIONAL REQUIREMENTS:
- Include Salah times
- Include Qur'an reading
- Include dhikr
- Balance productivity and spiritual growth
- Ensure no task is omitted
- Keep it realistic and not overwhelming
- Align tasks with priorities and spiritual goals
- Maintain balance between deen and dunya
- Be practical and structured

`;

      const completion = await openai.chat.completions.create({
        model: "gemini-flash-latest",
        messages: [
          {
            role: "system",
            content: `You are a helpful Islamic planner and a scheduling system. Return ONLY valid JSON.
            Do not wrap the response in markdown.
            Do not use \`\`\`json.
            Do not add explanations.
            Do not generate IDs.
            The backend will generate IDs.
            Include Rest & self-care.
            you MUST follow these rules strictly:
            Time format: h : mm AM/PM
            Hour must be 1-12 only
            Minutes must be 00-59
            No 24-hour format allowed
            Examples:
            8:00 AM, 9:15 AM, 12:30 PM, 2:45 PM

            Do NOT output:
            08:00, 14:30, 8:00AM


Return an array of tasks in this format:

[
  {
  
    "title": "Task title",
    "time": "h:mm AM/PM",
    "type": "worship",
    "completed": false,
    "description": "Task description",
  
  }
] Before responding, ensure all times are valid and corrected if needed.`,
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_completion_tokens: 1200,
      });

      const content = completion.choices[0].message.content;

      if (!content) {
        throw newCustomError("No response from AI", 422);
      }

      // console.log(" ai response", content);
      let parsedTasks;
      parsedTasks = JSON.parse(content);
      if (!Array.isArray(parsedTasks)) {
        throw newCustomError("AI response must be an array of tasks", 422);
      }
      // console.log("PARSE", parsedTasks);

      const tasks = assignIds(parsedTasks);
      // console.log("TASK", tasks);

      return {
        tasks,
        tokens: completion.usage?.total_tokens,
      };
    } catch (error: any) {
      console.error(
        "AI ERROR",
        error?.response?.data || error.message || error,
      );
      throw newCustomError("Daily plan generation failed", 500);
    }
  };
}

// export class Quran {
//   static getSurah = async (surahNumber: number) => {
//     try {
//       const response = await axios.get(`${API_URL}/v1/surah/${surahNumber}`);
//       return response.data;
//     } catch (error) {
//       // console.log(error);
//       throw newCustomError("failed to fetch surah", 400);
//     }
//   };
//   static getVerse = async (surah: number, ayah: number) => {
//     try {
//       const response = await axios.get(`${API_URL}/v1/quran/${surah}/${ayah}`);
//       return response.data;
//     } catch (error) {
//       throw new Error("failed to fecth verse");
//     }
//   };
//   static getEdition = async (edition: string) => {
//     try {
//       const response = await axios.get(`${API_URL}/v1/quran/${edition}`);
//       if (!response) throw newCustomError("Not found", 404);
//       return response.data;
//     } catch (error) {
//       throw new Error("failed to get quran edition");
//     }
//   };
// }
