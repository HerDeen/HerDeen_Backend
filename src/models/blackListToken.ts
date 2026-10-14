import mongoose, { Schema, Types } from "mongoose";

const blacklistSchema = new Schema({
  tokenId: {
    type: Types.ObjectId,
    ref: "Token",
  },
  token: { type: String, required: true, index: true },
  revokedAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
});

export const blackList = mongoose.model("Blacklist", blacklistSchema);
