import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRefreshToken, IRequest } from "../middleware/authMiddleware";
import { UserServices } from "../service/user.services";
import { ResponseStatus } from "openai/resources/responses/responses";

export class AuthControllers {
  static preRegister = asyncWrapper(async (req: IRequest, res: Response) => {
    const user = req.body;
    const response = await UserServices.preRegister(user);
    res.status(200).json({ success: true, payload: response });
  });

  static register = asyncWrapper(async (req: IRequest, res: Response) => {
    const user = req.body;
    const response = await UserServices.register(user);
    res.status(201).json({ success: true, payload: response });
  });

  static login = asyncWrapper(async (req: IRequest, res: Response) => {
    const { email, password } = req.body;
    const ipAddress = req.ip as string;
    const userAgent = req.headers["user-agent"] as string;
    const response = await UserServices.login(
      email,
      password,
      ipAddress,
      userAgent,
    );
    res.status(201).json({ success: true, payload: response });
  });

  static refreshToken = asyncWrapper(
    async (req: IRefreshToken, res: Response) => {
      const userId = req.user.id;
      const oldToken = req.refreshToken;
      // const oldToken = req.headers.authorization?.split("Bearer ")[1] as string;
      //  blackListToken.push()
      const response = await UserServices.refreshToken(userId, oldToken);
      res.status(200).json({ response });
    },
  );

  static logout = asyncWrapper(async (req: IRefreshToken, res: Response) => {
    const userId = req.user.id;
    const oldToken = req.refreshToken;
    const response = await UserServices.logout(userId, oldToken);
    res.status(200).json({ success: true, payload: response });
  });
  static reqOtp = asyncWrapper(async (req: IRequest, res: Response) => {
    const { email } = req.body;
    const response = await UserServices.requestOtp(email);
    res.status(201).json({ success: true, payload: response });
  });

  static resetPassword = asyncWrapper(async (req: IRequest, res: Response) => {
    const { email, otp, password, confirmPasssword } = req.body;
    const response = await UserServices.resetPassword(
      email,
      otp,
      password,
      confirmPasssword,
    );
    res.status(201).json({ success: true, payload: response });
  });

  static userAiData = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const { lifeStage, deenGoals } = req.body;
    const response = await UserServices.userAiData(
      userId,
      lifeStage,
      deenGoals,
    );
    res.status(201).json({ success: true, payload: response });
  });
}
