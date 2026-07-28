import crypto from "crypto";
import { otpModel } from "../models/otp.model";
import bcrypt from "bcrypt";


export const genOtp = async (email: string) => {
  const otp = crypto.randomInt(100000, 999999);
  console.log(otp);
  //hash otp
  const hashOtp = await bcrypt.hash(otp.toString(), 5);
  //delete old OTP
  const deleteOtp = await otpModel.findOneAndDelete({ email });
  await otpModel.create({ email, otp: hashOtp });
  return otp;
};




