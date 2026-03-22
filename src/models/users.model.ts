import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], default: "female" },
    dateOfBirth: { type: Date },
    lifeStage: {
      type: String,
      enum: [
        "student",
        "workingProfessional",
        "entrepreneur",
        "stayAtHome",
        "retired",
        "other",
      ],
      default: null,
    },
    deenGoals: [
      {
        type: String,
        enum: [
          "salahConsistency",
          "quranReading",
          "quranMemorization",
          "dhikr",
          "duas",
          "character",
          "knowledge",
          "timeManagement",
          "spiritualConsistency",
        ],
        default: [],
      },
    ],
    preferences: {
      wakeUpTime: String,
      sleepTime: String,
      workHours: {
        start: String,
        end: String,
      },
      studyHours: Number,
      preferredLearningStyle: {
        type: String,
        enum: ["reading", "video", "audio", "mixed"],
      },
    },
    timezone: { type: String, default: "Africa/Lagos" },
    userType: { type: String, enum: ["premium", "basic"], default: "basic" },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    nin: { type: Number, unique: true, sparse: true },
    bvn: { type: Number, unique: true, sparse: true },
    location: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    is_verified: { type: Boolean, default: false },
    is_kyc_verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const userModel = mongoose.model("User", userSchema);
