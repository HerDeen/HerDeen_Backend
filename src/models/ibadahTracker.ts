import mongoose, { Types, Schema, model } from "mongoose";

const ibadahTrackerSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, ref: "User" },
    date: { type: Date, required: true },
    salah: {
      fajr: { type: Boolean, default: false },
      dhuhr: { type: Boolean, default: false },
      asr: { type: Boolean, default: false },
      maghrib: { type: Boolean, default: false },
      isha: { type: Boolean, default: false },
    },
    quran: {
      pagesRead: { type: Number, default: 0 },
    },
    adhkaar: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);
ibadahTrackerSchema.index({ userId: 1, date: 1 }, { unique: true });

export const ibadahTrackerModel = mongoose.model(
  "Ibadah-Tracker",
  ibadahTrackerSchema,
);
