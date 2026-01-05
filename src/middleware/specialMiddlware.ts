// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import { Types } from "mongoose";
// import { admin_jwt_secret, jwt_secret } from "../config/system.variable";
// import { adminModel } from "../models/admin.model";
// import { userModel } from "../models/user.model";

// export interface CustomRequest extends Request {
//   admin: {
//     id: Types.ObjectId;
//     email: string;
//     username: string;
//     is_verified?: boolean;
//     isAuthorized?: boolean;
//     role: string;
//   };
//   user: {
//     id: Types.ObjectId;
//     email: string;
//     is_verified?: boolean;
//     role: string;
//   };
// }
// export const isAdminOrCustomer = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader?.split("Bearer ")[1];
//   if (!token) return res.sendStatus(401);

//   try {
//     const adminData: any = jwt.verify(token, admin_jwt_secret);
//     const admin = await adminModel.findById(
//       new Types.ObjectId(adminData.adminId)
//     );
//     if (
//       admin &&
//       (adminData.adminType === "admin" || adminData.adminType === "superAdmin")
//     ) {
//       req.admin = adminData;
//       return next();
//     }
//   } catch (err) {}

//   try {
//     const userData: any = jwt.verify(token, jwt_secret);
//     const user = await userModel.findById(new Types.ObjectId(userData.userId));
//     if (user && userData.userType === "customer") {
//       req.user = userData;
//       return next();
//     }
//   } catch (err) {}

//   res.status(403).send({ message: "Forbidden Zone" });
// };

// export const isAdminOrRestaurant = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader?.split("Bearer ")[1];
//   if (!token) return res.sendStatus(401);

//   try {
//     const adminData: any = jwt.verify(token, admin_jwt_secret);
//     const admin = await adminModel.findById(
//       new Types.ObjectId(adminData.adminId)
//     );
//     if (
//       admin &&
//       (adminData.adminType === "admin" || adminData.adminType === "superAdmin")
//     ) {
//       req.admin = adminData;
//       return next();
//     }
//   } catch (err) {}

//   try {
//     const userData: any = jwt.verify(token, jwt_secret);
//     const user = await userModel.findById(new Types.ObjectId(userData.userId));
//     if (user && userData.userType === "restaurant") {
//       req.user = userData;
//       return next();
//     }
//   } catch (err) {}

//   res
//     .status(403)
//     .send({ message: "You are not allowed to access this resources" });
// };
