import { response, Response } from "express";
import { IARequest } from "../middleware/adminAuthMiddleware";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { AdminService } from "../service/admin.services";
import { ResponseStatus } from "openai/resources/responses/responses";

export class authAdminController {
  static createAdmin = asyncWrapper(async (req: IARequest, res: Response) => {
    const { email } = req.body;
    const response = await AdminService.createAdmin(email);
    res.status(200).json({ success: true, payload: response });
  });
  static login = asyncWrapper(async (req: IARequest, res: Response) => {
    const { email, password } = req.body;
    const userAgent = req.headers["user-agent"] as string;
    const ipAddress = req.ip as string;
    const response = await AdminService.loginAdmin(
      email,
      password,
      userAgent,
      ipAddress,
    );
    res.status(200).json({ success: true, payload: response });
  });

  static requesOtp = asyncWrapper(async (req: IARequest, res: Response) => {
    const email = req.admin.email;
    const response = await AdminService.requestOtp(email);
    res.status(200).json({ success: true, payload: response });
  });

  static changePassword = asyncWrapper(
    async (req: IARequest, res: Response) => {
      const adminId = req.admin.id;
      const { password, data } = req.body;
      const response = await AdminService.changePassword(
        adminId,
        password,
        data,
      );
      res.status(201).json({ success: true, payload: response });
    },
  );

  static resetPassword = asyncWrapper(async (req: IARequest, res: Response) => {
    const adminid = req.admin.id;
    const { otp, password, confirmPasssword } = req.body;
    const response = await AdminService.resetPassword(
      adminid,
      otp,
      password,
      confirmPasssword,
    );
    res.status(201).json({ success: true, payload: response });
  });
}
