import OpenAI from "openai";
import { newCustomError } from "../middleware/errorHandler";
import { userModel } from "../models/users.model";
import { Types } from "mongoose";
import { gemini_api_key } from "../config/system.variable";
import { DailyPlanInput, IDailyPlan } from "../interface/daily.plan.interface";
import { dailyPlanModel } from "../models/dailyPlan.model";

const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: gemini_api_key,
});

export class AiPlan {
  static dailyPlan = async (
    userId: Types.ObjectId,
    userInputs?: {
      tasks?: string[];
      priorities?: string[];
      spiritualFocus?: string[];
      notes?: string;
    },
  ) => {
    try {
      const input = await userModel.findById(userId);
      if (!input) throw newCustomError("no user found", 404);
      const dailyPlan = await dailyPlanModel.findOne({ userId });
      if (!dailyPlan) throw newCustomError("No plan foundsssss", 404);
      // const userInputs = dailyPlan.userInputs;

      const prompt = `
        You are an Islamic lifestyle and productivity assistant.

        user Profile: 
        - Name: ${input.firstName}
        - Gender: ${input.gender}
- Life stage: ${input.lifeStage}
- Location: ${input.location?.city || ""}, ${input.location?.country || ""}

Deen goals:
${input.deenGoals.join(", ")}

User Preferences:
- Tasks: ${userInputs?.tasks?.join(", ") || "None"}
- Priorities: ${userInputs?.priorities?.join(", ") || "None"}
- Spiritual Focus: ${userInputs?.spiritualFocus?.join(", ") || "None"}
- Notes: ${userInputs?.notes || "None"}

Create a personalized daily plan including:
- Salah schedule
- Qur'an reading
- Dhikr & duas
- Work / study
- Rest

Make it practical, balanced, and realistic.



    `;

      const completion = await openai.chat.completions.create({
        model: "gemini-flash-latest",
        messages: [
          { role: "system", content: "You are a helpful Islamic planner." },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 600,
      });
      return {
        response: completion.choices[0].message.content,
        tokens: completion.usage?.total_tokens,
      };
    } catch (error: any) {
      console.error(
        "AI ERROR 👉",
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
