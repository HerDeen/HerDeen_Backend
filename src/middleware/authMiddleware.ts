import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { jwt_refresh_token, jwt_secret } from "../config/system.variable";
import { userModel } from "../models/users.model";
import { string } from "joi";

export interface IRequest extends Request {
  user: {
    id: Types.ObjectId;
    email: string;
    is_verified?: boolean;
    userType: string;
  };
}
export interface IRefreshToken extends Request {
  refreshToken: string;
  user: {
    id: Types.ObjectId;
    email: string;
    is_verified?: boolean;
    userType: string;
  };
}

// export const invalidTokens: string[] = [];
export const authMiddleware = (
  req: IRequest,
  res: Response,
  next: NextFunction,
): any => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split("Bearer ")[1];
  if (!token) return res.sendStatus(401);
  // if (invalidTokens.includes(token))
  //   return res.status(403).json({
  //     success: false,
  //     message: "forbideen",
    // });
  jwt.verify(token, jwt_secret, async (err, data: any) => {
    if (err) {
      return res.sendStatus(401);
    }
    const user = await userModel.findById(new Types.ObjectId(data.userId));
    console.log(data);
    if (!user) return res.sendStatus(401);
    req.user = {
      id: user._id,
      email: user.email as string,
      is_verified: user.is_verified,
      userType: user.userType as string,
    };
    next();
  });
};

export const authRefreshMiddleware = (
  req: IRefreshToken,
  res: Response,
  next: NextFunction,
): any => {
  const refreshAuthHeader = req.headers.authorization;

  const oldToken = refreshAuthHeader?.split("Bearer ")[1]; // Bearer token
  // const refreshToken = refreshAuthHeader?.split("Bearer ")[1];
  if (!oldToken) return res.sendStatus(401);

  jwt.verify(oldToken, jwt_refresh_token, async (err, data: any) => {
    if (err) {
      return res.sendStatus(401);
    }
    const user = await userModel.findById(new Types.ObjectId(data.userId));
    console.log(data);
    if (!user) return res.sendStatus(401);
    req.user = {
      id: user._id,
      email: user.email as string,
      is_verified: user.is_verified,
      userType: user.userType as string,
    };
    req.refreshToken = oldToken;
    next();
  });
};
