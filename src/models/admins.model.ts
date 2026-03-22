import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    username: { type: String, required: false, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["superAdmin", "admin"], default: "admin" },
    isAuthorized: { type: Boolean, required: false, default: false },
    isVerified: { type: Boolean, required: true, default: false },
    phoneNumber: { type: String },
    location: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
  },
  {
    timestamps: true,
  },
);

export const adminModel = mongoose.model("Admin", adminSchema);
