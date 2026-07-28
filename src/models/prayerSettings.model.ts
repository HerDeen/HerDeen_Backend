import mongoose, { Schema, Types } from "mongoose";

const prayerSettingsSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    remindersEnabled: {
      type: Boolean,
      default: false,
    },
    minutesBefore: {
      type: Number,
      default: 10,
      min: 0,
    },

    sound: {
      type: Boolean,
      default: true,
    },

    vibration: {
      type: Boolean,
      default: true,
    },

    latitude: Number,
    longitude: Number,

    timezone: {
      type: String,
      default: "Africa/Lagos",
    },

    calculationMethod: {
      type: String,
      enum: ["MuslimWorldLeague", "Egyptian", "Karachi", "UmmAlQura"],
      default: "MuslimWorldLeague",
    },

    madhab: {
      type: String,
      enum: ["Shafi", "Hanafi"],
      default: "Shafi",
    },
  },
  {
    timestamps: true,
  },
);

export const prayerSettingModel = mongoose.model(
  "Prayer Settings",
  prayerSettingsSchema,
);
