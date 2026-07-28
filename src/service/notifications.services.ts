import admin from "../config/firebase";
import { newCustomError } from "../middleware/errorHandler";

export class NotificationService {
  static sendPushNotication = async (
    token: string,
    title: string,
    body: string,
  ) => {
    try {
      const mesaageId = await admin.messaging().send({
        token,
        notification: {
          title,
          body,
        },
      });
      return mesaageId;
    } catch {
      throw newCustomError("Invalid message id", 400);
    }
  };
}
