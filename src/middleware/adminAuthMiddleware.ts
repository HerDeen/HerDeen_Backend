// import { NextFunction, Request, Response } from "express";
// import { Types } from "mongoose";
// import jwt from "jsonwebtoken";
// import { admin_jwt_secret } from "../config/system.variable";
// import { adminModel } from "../models/admin.model";

// export interface IARequest extends Request {
//   admin: {
//     id: Types.ObjectId;
//     email: string;
//     username: string;
//     is_verified?: boolean;
//     isAuthorized?: boolean;
//     role: string;
//   };
// }

// export const adminAuthMiddleware = (
//   req: IARequest,
//   res: Response,
//   next: NextFunction
// ): any => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader?.split("Bearer ")[1];
//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, admin_jwt_secret, async (err, data: any) => {
//     if (err) {
//       return res.sendStatus(401);
//     }
//     const admin = await adminModel.findById(new Types.ObjectId(data.adminId));
//     if (!admin) return res.sendStatus(404);
//     req.admin = {
//       email: admin.email as string,
//       id: admin._id,
//       username: admin.username as string,
//       is_verified: admin.is_verified,
//       isAuthorized: admin.isAuthorized,
//       role: admin.role as string,
//     };
//     next();
//   });
// };

// // export const adminsMiddleware = (
// //   req: IARequest,
// //   res: Response,
// //   next: NextFunction
// // ) => {
// //   const admin = req.admin;
// //   if (!admin) return res.sendStatus(403);
// //   if (admin.role !== "superAdmin" || "admin") {
// //     return res
// //       .sendStatus(403)
// //       .json({ payload: "You are not authorized to access this resources" });
// //   }
// //   next();
// // };

// export const superAdminMiddleware = (
//   req: IARequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const admin = req.admin;
//   if (!admin) return res.sendStatus(403);
//   if (admin.role !== "superAdmin") {
//     return res.status(403).json({
//       status: false,
//       payload: "You are not authorized to access this resources",
//     });
//   }
//   next();
// };
