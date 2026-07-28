// import mongoose, { Schema, Types } from "mongoose";

// const aiGenerationLogSchema = new Schema(
//   {
//     dailyPlanId: {
//       type: Types.ObjectId,
//       ref: "Daily-Plan",
//       required: true,
//     },
//     userId: {
//       type: Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: ["daily", "weekly", "ramadan"],
//       required: true,
//     },
//     inputSnapshot: {
//       lifeStage: String,
//       deenGoals: [String],
//       preferences: Schema.Types.Mixed,
//       timezone: String,
//       location: {
//         city: String,
//         country: String,
//       },
//       userInputs: Schema.Types.Mixed,
//     },
//     prompt: { type: String, required: true },
//     response: { type: Schema.Types.Mixed, required: true },
//     model: { type: String },
//     tokensUsed: { type: Number },
//     latencyMs: { type: Number },
//     status: {
//       type: String,
//       enum: ["success", "failed"],
//       required: true,
//     },
//     error: { type: String },
//   },
//   { timestamps: true },
// );

// export const AiGenerationLog = mongoose.model(
//   "AiGenerationLog",
//   aiGenerationLogSchema,
// );
