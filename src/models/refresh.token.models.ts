import mongoose, { Schema, Types } from "mongoose";

const tokenSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true },
    iv: { type: String, required: false },
    authTag: { type: String, required: false },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  },
);

export const tokenModel = mongoose.model("Token", tokenSchema);
