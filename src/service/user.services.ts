import { IPreRegister, IRegister } from "../interface/users.interface";
import { newCustomError } from "../middleware/errorHandler";
import { userModel } from "../models/users.model";
import bcrypt from "bcrypt";
import {
  login,
  mailValid,
  PreReg,
  register,
  resetValid,
  userAiValid,
} from "../validation/users.validate";
import crypto from "crypto";
import { otpModel } from "../models/otp.model";

import { otpTemplate } from "../utils/otpTemp";
import Jwt from "jsonwebtoken";
import {
  encrypt_password,
  jwt_exp,
  jwt_refresh_exp,
  jwt_refresh_token,
  jwt_secret,
} from "../config/system.variable";
import { loginTemplate } from "../utils/loginTemp";
import { Types } from "mongoose";
import { tokenModel } from "../models/refresh.token.models";
import { Secure } from "../utils/crypto";
import { blackList } from "../models/blackListToken";
import { genOtp } from "../utils/genOtp";
import { sendEmail } from "../utils/resendMailer";

export class UserServices {
  static preRegister = async (user: IPreRegister) => {
    const { error } = PreReg.validate(user);
    if (error) throw newCustomError(error.message, 400);
    //check user existence
    const isUser = await userModel.findOne({ email: user.email });
    if (isUser?.is_verified === false)
      throw newCustomError(
        "Account already exist but not verified. kindly request for an OTP to continue.",
        409,
      );
    if (isUser) throw newCustomError("Email already exist", 409);
    //hash password
    const hashedPwd = await bcrypt.hash(user.password as string, 10);
    //create new user
    const newUser = await userModel.create({ ...user, password: hashedPwd });
    if (!newUser) throw newCustomError("Unable to create an account", 422);
    //generate otp
    const otp = await genOtp(user.email);
    if (!otp) throw newCustomError("Unable to genereate OTP", 500);

    const saveOtp = await otpModel.findOneAndUpdate(
      { email: newUser.email },
      { $set: { entityId: newUser._id, entityType: "User" } },
      { new: true },
    );
    //send mail to user
    sendEmail(
      {
        email: user.email as string,
        subject: "Otp Verification",
        emailInfo: {
          otp: otp.toString(),
          name: `${user.firstName} ${user.lastName}`,
        },
      },
      otpTemplate,
    );
    return "Account created, Successfully. check your email for an OTP to continue";
  };

  static register = async (user: IRegister) => {
    const { error } = register.validate(user);
    if (error) throw newCustomError(error.message, 400);
    //check email valid
    const validUser = await userModel.findOne({ email: user.email });
    if (!validUser) throw newCustomError("No record found", 404);
    //check if user is registered
    if (validUser.is_verified)
      throw newCustomError("Acoount already exist, Login Instead.", 409);

    //chek if Otp still exist
    const otpExist = await otpModel.findOne({ email: user.email });
    if (otpExist?.entityType !== "User")
      throw newCustomError("Invalid Token", 404);
    if (!otpExist) throw newCustomError("OTP Expired", 401);
    //check otp validity
    const otpValid = await bcrypt.compare(
      user.otp.toString(),
      otpExist.otp as string,
    );
    if (!otpValid) throw newCustomError("Invalid OTP", 401);
    //verify user
    const verify = await userModel.findByIdAndUpdate(
      validUser._id,
      { is_verified: true },
      { new: true },
    );
    if (!verify) throw newCustomError("Unable to verify account", 422);
    return "Account Verified. You can now login";
  };

  static login = async (
    email: string,
    password: string,
    ipAddress: string,
    userAgent: string,
  ) => {
    const { error } = login.validate({ email, password });
    if (error) throw newCustomError(error.message, 400);
    //check email
    const userValid = await userModel.findOne({ email });
    if (!userValid) throw newCustomError("Invalid email", 404);
    //password validate
    const isPwdAuth = await bcrypt.compare(
      password,
      userValid.password as string,
    );
    if (!isPwdAuth) throw newCustomError("Invalid email/password", 401);
    //save to payload
    const payload = {
      userId: userValid._id,
      userType: userValid.userType,
    };
    let jwtkey = Jwt.sign(payload, jwt_secret, { expiresIn: jwt_exp as any });
    if (!jwtkey) throw newCustomError("Unable to Login at this moment", 401);
    let jwtKeyRefresh = Jwt.sign(payload, jwt_refresh_token, {
      expiresIn: jwt_refresh_exp as any,
    });
    if (!jwtKeyRefresh)
      throw newCustomError("Unable to refresh at this moment", 401);
    //send mail
    await sendEmail(
      {
        email: email,
        subject: "Login Attempt",
        emailInfo: {
          ipAddress: ipAddress,
          userAgent: userAgent,
        },
      },
      loginTemplate,
    );
    const encryptToken = await Secure.encrypt(jwtKeyRefresh, encrypt_password);
    await tokenModel.create({
      userId: userValid._id,
      token: encryptToken.encrypted,
      iv: encryptToken.iv,
      authTag: encryptToken.authTag,
    });
    return {
      message: "Login Successful",
      authKey: jwtkey,
      refreshToken: jwtKeyRefresh,
    };
  };

  static logout = async (userId: Types.ObjectId, oldToken: string) => {
    const user = await userModel.findById(userId);
    const payload = {
      userId: user?._id,
      userType: user?.userType,
    };

    const blacklistToken = await tokenModel.findOneAndUpdate(
      { userId },
      { revoked: true },
      { new: true },
    );
    if (!blacklistToken) throw newCustomError("Unable to blacklist Token", 422);
    const encrypt = await Secure.encrypt(oldToken, encrypt_password);
    await blackList.create({
      token: encrypt.encrypted,
      userId,
      revokedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // match expiry
    });
    return "Logout Succcessfuly";
  };

  static refreshToken = async (userId: Types.ObjectId, oldToken: string) => {
    const user = await userModel.findById(userId);
    const payload = {
      userId: user?._id,
      userType: user?.userType,
    };
    // check if token is blacklisted
    const blacklist = await blackList.findOne({ token: oldToken });
    if (blacklist) throw newCustomError("blacklisted Token", 404);
    //create new access token
    let jwtkey = Jwt.sign(payload, jwt_secret, { expiresIn: jwt_exp as any });
    if (!jwtkey) throw newCustomError("Unable to Login at this moment", 401);
    //create new refresh token
    let jwtKeyRefresh = Jwt.sign(payload, jwt_refresh_token, {
      expiresIn: jwt_refresh_exp as any,
    });
    if (!jwtKeyRefresh)
      throw newCustomError("Unable to refresh at this moment", 401);
    //  Blacklist old token
    const encrypt = await Secure.encrypt(oldToken, encrypt_password);
    await blackList.create({
      userId,
      token: encrypt.encrypted,
      revokedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // match expiry
    });
    const encryptToken = await Secure.encrypt(jwtKeyRefresh, encrypt_password);
    await tokenModel.findOneAndUpdate({
      userId: userId,
      token: encryptToken.encrypted,
      iv: encryptToken.iv,
      authTag: encryptToken.authTag,
    });
    return {
      messsage: "refresh successful",
      authKey: jwtkey,
      auhtRefreshToken: jwtKeyRefresh,
    };
  };

  static requestOtp = async (email: string) => {
    const { error } = mailValid.validate({ email });
    if (error) throw newCustomError(error.message, 400);
    //check mail validity
    const user = await userModel.findOne({ email });
    if (!user) throw newCustomError("Invalid User", 404);
    //gen OTP
    const otp = await genOtp(email);
    if (!otp) throw newCustomError("Unable to genereate OTP", 500);

    const saveOtp = await otpModel.findOneAndUpdate(
      { email },
      { $set: { entityId: user._id, entityType: "User" } },
      { new: true },
    );
    if (!saveOtp) throw newCustomError("Unable to update otp", 422);
    //send mail to user
    sendEmail(
      {
        email: user.email as string,
        subject: "OTP Verification",
        emailInfo: {
          otp: otp.toString(),
          name: `${user.firstName} ${user.lastName}`,
        },
      },
      otpTemplate,
    );
    return "An OTP has been sent to your email.";
  };

  static resetPassword = async (
    email: string,
    otp: string,
    password: string,
    confirmPasssword: string,
  ) => {
    const { error } = resetValid.validate({
      email,
      otp,
      password,
      confirmPasssword,
    });
    if (error) throw newCustomError(error.message, 400);
    //check email
    const user = await userModel.findOne({ email });
    if (!user) throw newCustomError("No user Found", 404);
    const userOtp = await otpModel.findOne({ email: user?.email });
    if (userOtp?.entityType !== "User")
      throw newCustomError("Invalid token", 404);
    if (!userOtp) throw newCustomError("Expired OTP", 404);
    //check otp validity
    const otpValid = await bcrypt.compare(
      otp.toString(),
      userOtp.otp as string,
    );
    if (!otpValid) throw newCustomError("Invalid OTP", 401);
    //compare new passwords
    if (confirmPasssword !== password)
      throw newCustomError("Password must match", 422);
    //hash password
    const hashPassword = await bcrypt.hash(confirmPasssword, 10);
    //update password
    const response = await userModel.findByIdAndUpdate(
      { _id: user._id },
      { $set: { password: hashPassword } },
      { new: true },
    );
    if (!response) throw newCustomError("Unable to reset password", 409);
    return "Password Changed";
  };

  static userAiData = async (
    userId: Types.ObjectId,
    lifeStage: string,
    deenGoals: string[],
  ) => {
    const { error } = userAiValid.validate({ lifeStage, deenGoals });
    if (error) throw newCustomError(error.message, 400);
    //update
    const updateData = await userModel.findByIdAndUpdate(
      userId,
      { $set: { lifeStage, deenGoals } },
      { new: true },
    );
    if (!updateData) throw newCustomError("Unable to complete request", 422);
    return "Changes saved";
  };
}
