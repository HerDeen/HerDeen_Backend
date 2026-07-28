import mongoose, { Schema, Types } from "mongoose";

const otpSchema = new Schema(
  {
    entityId: { type: Types.ObjectId, required: false },
    entityType: { type: String, enum: ["Admin", "User"], required: false },
    email: { type: String, require: true },
    otp: { type: String, require: true },
    expiresAt: {
      type: Date,
      require: true,
      default: () => new Date(Date.now() + 1 * 60 * 1000),
      expires: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const otpModel = mongoose.model("Otp", otpSchema);

// const adminOtpSchema = new Schema(
//   {
//     adminId: { type: Types.ObjectId, require: true, ref: "Admin" },
//     email: { type: String, require: true },
//     otp: { type: String, require: true },
//     expiresAt: {
//       type: Date,
//       require: true,
//       default: () => new Date(Date.now() + 1 * 60 * 1000),
//       expires: 0,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// export const adminOtpModel = mongoose.model("AdminOtp", adminOtpSchema);
