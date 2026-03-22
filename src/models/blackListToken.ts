import mongoose, { Schema, Types } from "mongoose";

const blacklistSchema = new Schema({
  token: { type: String, required: true, index: true },
  userId: {
    type: Types.ObjectId,
    ref: "User",
  },
  revokedAt: { type: Date, default: Date.now, expires: 0 },
});

export const blackList = mongoose.model("Blacklist", blacklistSchema);
