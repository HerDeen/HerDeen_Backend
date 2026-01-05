// import { NextFunction, Request, Response } from "express";
// import { Types } from "mongoose";
// import jwt from "jsonwebtoken";
// import { jwt_secret } from "../config/system.variable";
// import { userModel } from "../models/user.model";
// import { adminModel } from "../models/admin.model";
// import { restaurantModel } from "../models/restaurant.model";

// export interface IRequest extends Request {
//   user: {
//     id: Types.ObjectId;
//     email: string;
//     is_verified?: boolean;
//     role: string;
//   };
// }

// export const authMiddleware = (
//   req: IRequest,
//   res: Response,
//   next: NextFunction
// ): any => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader?.split("Bearer ")[1];
//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, jwt_secret, async (err, data: any) => {
//     if (err) {
//       return res.sendStatus(401);
//     }
//     const user = await userModel.findById(new Types.ObjectId(data.userId));
//     console.log(data);
//     if (!user) return res.sendStatus(401);
//     req.user = {
//       email: user.email as string,
//       id: user._id,
//       is_verified: user.is_verified,
//       role: user.role as string,
//     };
//     next();
//   });
// };

// export const customerMiddleware = (
//   req: IRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = req.user;
//   if (!user) return res.sendStatus(403);
//   if (user.role !== "customer") {
//     return res
//       .status(403)
//       .json({ payload: "You are not authorized to access this resources" });
//   }
//   next();
// };

// export const restaurantMiddleware = (
//   req: IRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = req.user;

//   if (!user) return res.sendStatus(403);
//   if (user.role !== "restaurant") {
//     return res.status(403).json({
//       success: false,
//       payload: "You are not authorized to access this resources",
//     });
//   }
//   next();
// };
