import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { IbadahTrackerService } from "../service/ibadahTracker.services";

export class IbadahTrackerController {
  static getTodayTracker = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const userId = req.user.id;
      const response = await IbadahTrackerService.getTodayTracker(userId);
      res.status(200).json({ success: true, payload: response });
    },
  );

  static togglePrayer = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const { prayer, completed } = req.body;
    const response = await IbadahTrackerService.togglePrayer(
      userId,
      prayer,
      completed,
    );
    res.status(200).json({ success: true, payload: response });
  });

  static updateQuranPages = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const userId = req.user.id;
      const { pagesRead } = req.body;
      const response = await IbadahTrackerService.updateQuranPages(
        userId,
        pagesRead,
      );
      res.status(200).json({ success: true, payload: response });
    },
  );

  static toggleAdhkaar = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const { completed } = req.body;
    const response = await IbadahTrackerService.toggleAdhkaar(
      userId,
      completed,
    );
    res.status(200).json({ success: true, payload: response });
  });
}
