import cron from "node-cron";
import { prayerSettingModel } from "../../models/prayerSettings.model";
import { prayerReminderQueue } from "../../config/db.connection";

cron.schedule("* * * * *", async () => {
  //   console.log("[CRON] Running prayer reminder scheduler...");
  const settings = await prayerSettingModel.find({ remindersEnabled: true });
  //   console.log(`[CRON] Found ${settings.length} users`);
  for (const setting of settings) {
    // console.log(`[CRON] Queueing ${setting.userId}`);
    await prayerReminderQueue.add(
      "prayer-reminder-queue",
      { userId: setting.userId.toString() },
      {
        attempts: 1,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: true,
      },
    );
  }
});
