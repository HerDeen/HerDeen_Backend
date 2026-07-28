import mongoose, { Schema, Types } from "mongoose";

const tokenSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    expiresAt: Date,
  },
  {
    timestamps: true,
  },
);

export const tokenModel = mongoose.model("Token", tokenSchema);
