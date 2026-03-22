import {
  admin_email,
  admin_exp,
  admin_jwt,
  admin_password,
  admin_refresh_exp,
  admin_username,
} from "../config/system.variable";
import { IAdminReg } from "../interface/admins.interface";
import { newCustomError } from "../middleware/errorHandler";
import { adminModel } from "../models/admins.model";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  adminLogin,
  adminReg,
  changePwd,
  emailValid,
  resetPwd,
} from "../validation/admins.validate";
import { otpModel } from "../models/otp.model";
import { Types } from "mongoose";
import { sendMail } from "../utils/nodemailer";
import { otpTemplate } from "../utils/otpTemp";
import { genOtp } from "../utils/genOtp";
import { welcomeAdminTemp } from "../utils/adminTemp";

export class AdminService {
  static superAdmin = async () => {
    const existingAdmin = await adminModel.findOne({ email: admin_email });
    const hashPwd = await bcrypt.hash(admin_password, 10);
    if (!existingAdmin) {
      const admin = await adminModel.create({
        email: admin_email,
        username: admin_username,
        password: hashPwd,
        isVerified: true,
        isAuthorized: true,
        role: "superAdmin",
      });
      await admin.save();
      console.log("Admin Created");
    } else {
      console.log(`Welcome ${admin_username}`);
    }
  };
  static createAdmin = async (email: string) => {
    const { error } = emailValid.validate({ email });
    if (error) throw newCustomError(error.message, 400);
    // const admin = await adminModel.findById(adminId);
    //check if email exist
    const adminExist = await adminModel.findOne({ email });
    if (adminExist) throw newCustomError("email already in use", 422);
    //generete temporary password
    const genTempPassword = () => {
      return crypto.randomBytes(8).toString("hex");
    };
    const tempPassword = genTempPassword();
    const hashedPwd = await bcrypt.hash(tempPassword as string, 10);
    //create new admin account
    const newAdmin = await adminModel.create({
      email: email,
      password: hashedPwd,
    });
    if (!newAdmin) throw newCustomError("Unable to create admin", 422);
    await newAdmin.save();
    sendMail(
      {
        email: newAdmin.email,
        subject: "Welcome Admin",
        emailInfo: {
          email: newAdmin.email,
          tempPassword: tempPassword,
        },
      },
      welcomeAdminTemp,
    );
    return "Admin account created";
  };

  static loginAdmin = async (
    email: string,
    password: string,
    userAgent: string,
    ipAddress: string,
  ) => {
    const { error } = adminLogin.validate({ email, password });
    if (error) throw newCustomError(error.message, 400);
    const admin = await adminModel.findOne({ email });
    if (!admin) throw newCustomError("No Admin found", 404);
    const pwdAuth = await bcrypt.compare(password, admin.password);
    if (!pwdAuth) throw newCustomError("Invalid email/password", 401);
    const payload = {
      adminId: admin._id,
      adminType: admin.role,
    };

    let jwtKey = Jwt.sign(payload, admin_jwt, { expiresIn: admin_exp as any });
    if (!jwtKey) throw newCustomError("unable to generate a token", 422);
    let jwtKeyRefresh = Jwt.sign(payload, admin_jwt, {
      expiresIn: admin_refresh_exp as any,
    });
    if (!jwtKeyRefresh)
      throw newCustomError("unable to generate refresh token", 422);

    return {
      message: "Login Successful",
      authKey: jwtKey,
      refreshToken: jwtKeyRefresh,
    };
  };

  static requestOtp = async (email: string) => {
    const { error } = emailValid.validate(email);
    if (error) throw newCustomError(error.message, 400);
    //verify email
    const admin = await adminModel.findOne({ email });
    if (!admin) throw newCustomError("Invalid email", 404);
    const otp = await genOtp(admin.email);
    const saveOtp = await otpModel.findOneAndUpdate(
      { email: admin.email },
      { $set: { entityId: admin._id, entityType: "Admin" } },
      { new: true },
    );
    if (!saveOtp) throw newCustomError("unable to save otp", 422);
    sendMail(
      {
        email: admin.email,
        subject: "OTP VERIFICATION",
        emailInfo: {
          otp: otp.toString(),
          name: `${admin.firstName} ${admin.lastName}`,
        },
      },
      otpTemplate,
    );
  };
  static changePassword = async (
    adminId: Types.ObjectId,
    password: string,
    data: { password: string; confirmPassword: string },
  ) => {
    const { error } = changePwd.validate({ data });
    if (error) throw newCustomError(error.message, 400);
    //check admin
    const admin = await adminModel.findById(adminId);
    //check password authencity
    const isPwdvalid = await bcrypt.compare(
      password,
      admin?.password as string,
    );
    if (!isPwdvalid) throw newCustomError("Incorrect password", 409);
    //compare new passwords and hash
    if (data.confirmPassword !== data.password) {
      throw newCustomError("Password must match", 422);
    }
    //hash password
    const hashPassword = await bcrypt.hash(data.confirmPassword, 10);
    const response = await adminModel.findByIdAndUpdate(
      { _id: admin?.id },
      { $set: { password: hashPassword } },
      { new: true },
    );
    if (!response) throw newCustomError("unable to save changes", 422);
    return "Password changed";
  };
  static resetPassword = async (
    adminId: Types.ObjectId,
    otp: string,
    password: string,
    confirmPasssword: string,
  ) => {
    const { error } = resetPwd.validate({ password, confirmPasssword });
    if (error) throw newCustomError(error.message, 400);

    //verify admin
    const admin = await adminModel.findById(adminId);
    if (!admin) throw newCustomError("Invalid user", 404);
    const otpExist = await otpModel.findById({ entityId: admin._id });
    if (otpExist?.entityType !== "Admin") {
      throw newCustomError("Invalid OTP", 404);
    }
    if (!otpExist) throw newCustomError("Expired OTP", 404);
    //verify otp
    const otpValid = await bcrypt.compare(
      otp.toString(),
      otpExist.otp as string,
    );
    if (confirmPasssword !== password) {
      throw newCustomError("Password must match", 422);
    }
    //hash password
    const hashedPwd = await bcrypt.hash(confirmPasssword, 10);
    if (!hashedPwd) throw newCustomError("Unable to hash password", 422);
    const response = await adminModel.findByIdAndUpdate(
      { _id: admin._id },
      { $set: { password: hashedPwd } },
      { new: true },
    );
    if (!response) throw newCustomError("Unable to reset password", 409);
    return "Password changed";
  };
}
