import mongoose, { Types, Schema, model } from "mongoose";

const dailySpiritualContent = new Schema(
  {
    type: {
      type: String,
      enum: ["quran", "hadith", "reflection", "article"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    source: {
      type: String,
      trim: true,
      default: "",
    },

    language: {
      type: String,
      default: "en",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const dailyContentModel = mongoose.model(
  "DailySpiritualContent",
  dailySpiritualContent,
);
