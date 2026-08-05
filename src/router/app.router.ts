import express from "express";
import { QuranContoller } from "../controller/quran.controllers";
import { AuthControllers } from "../controller/auth.controllers";
import {
  authMiddleware,
  authRefreshMiddleware,
} from "../middleware/authMiddleware";
import { DailyPlanController } from "../controller/dailyPlan.controllers";
import { authAdminController } from "../controller/admin.controllers";
import {
  adminAuthMiddleware,
  superAdminMiddleware,
} from "../middleware/adminAuthMiddleware";
import { DailyPlanServices } from "../service/dailyPlan.services";
import { PrayerSettingController } from "../controller/prayerSettings.controllers";
import { PrayerTimesController } from "../controller/prayerTime.controllers";
import { IbadahTrackerController } from "../controller/ibadahTracker.controllers";
import { MenstrualLogController } from "../controller/menstrualLog.controllers";
import { DailySpiritualController } from "../controller/dailyContent.controllers";

const router = express.Router();
//*********************|| ADMIN MANAGEMENT ||*********************************//
router.post(
  "/auth/admin/create",
  adminAuthMiddleware as any,
  superAdminMiddleware as any,
  authAdminController.createAdmin,
);
router.post("/auth/admin/login", authAdminController.login);

router.post("/auth/admin/otp", authAdminController.requesOtp);
router.patch(
  "/auth/admin/passowrd",
  adminAuthMiddleware as any,
  authAdminController.changePassword,
);

router.patch("/auth/admin/reset-password", authAdminController.resetPassword);

//*********************|| USER MANAGEMENT ||*********************************//
router.post("/auth/pre-register", AuthControllers.preRegister);
router.post("/auth/register", AuthControllers.register);
router.post("/auth/login", AuthControllers.login);
router.post(
  "/auth/logout",
  authRefreshMiddleware as any,
  AuthControllers.logout,
);
router.post(
  "/auth/refresh",
  authRefreshMiddleware as any,
  AuthControllers.refreshToken,
);
router.post("/auth/forgot-password", AuthControllers.reqOtp);
router.patch("/auth/reset-password", AuthControllers.resetPassword);
router.post("/auth/request-otp", AuthControllers.reqOtp);
router.patch(
  "/auth/user-data",
  authMiddleware as any,
  AuthControllers.userAiData,
);

//**********************************|| DAILY PLAN MGMT ||***************************************//
router.post(
  "/planner/generate",
  authMiddleware as any,
  DailyPlanController.myDailyPlan,
);
router.get(
  "/planner/daily/:date",
  authMiddleware as any,
  DailyPlanController.getPlan,
);
router.get(
  "/planner/history",
  authMiddleware as any,
  DailyPlanController.planHistory,
);
router.put(
  "/planner/completed/:task",
  authMiddleware as any,
  DailyPlanController.taskCompleted,
);

router.put(
  "/planner/edit/:taskId",
  authMiddleware as any,
  DailyPlanController.editTask,
);

router.get(
  "/planner/completed/tasks",
  authMiddleware as any,
  DailyPlanController.getCompletedTasks,
);

router.post(
  "/planner/add",
  authMiddleware as any,
  DailyPlanController.addNewTask,
);
router.delete(
  "/planner/:taskId",
  authMiddleware as any,
  DailyPlanController.removeTask,
);
router.post("/clear-cache", DailyPlanController.clearCahcePlan);

//************************************||PRAYER MGMT.  ||******************************//
router.patch(
  "/prayer",
  authMiddleware as any,
  PrayerSettingController.updatePrayerSetting,
);

router.get(
  "/islamic/prayer-times",
  authMiddleware as any,
  PrayerTimesController.prayerTimes,
);
// *********************\\ IBADAH TRACKER\\********************//
router.get(
  "/tracker/today",
  authMiddleware as any,
  IbadahTrackerController.getTodayTracker,
);

router.patch(
  "/tracker/toggle-prayer",
  authMiddleware as any,
  IbadahTrackerController.togglePrayer,
);

router.patch(
  "/tracker/quran",
  authMiddleware as any,
  IbadahTrackerController.updateQuranPages,
);

router.patch(
  "/tracker/adhkaar",
  authMiddleware as any,
  IbadahTrackerController.toggleAdhkaar,
);
//*********************************||MENSTRUAL LOG MGMT||******************************//
router.post(
  "/menstrual-cycle",
  authMiddleware as any,
  MenstrualLogController.ceateMenstrualLog,
);

router.patch(
  "/menstrual-cycle",
  authMiddleware as any,
  MenstrualLogController.updateMentsrual,
);
router.get(
  "/menstrual-cycle",
  authMiddleware as any,
  MenstrualLogController.getMenstrualLog,
);
//************************||DAILY SPIRITUAL CONTENT||************************ *//
router.post("/daily-content", DailySpiritualController.createContent);
router.patch(
  "/daily-content/:contentId",
  DailySpiritualController.updateContent,
);
router.delete(
  "/daily-content/:contentId",
  DailySpiritualController.deleteContent,
);
router.get("/daily-content", DailySpiritualController.getTodayContent);

//TEST FOR PRAYER REMINDER
// router.post(
//   "/islamic/prayer-reminder",
//   authMiddleware as any,
//   PrayerTimesController.prayerReminder,
// );
//**************************************|| QURAN MANAGEMENT ||**************************//
// router.get("/surah/:surahNumber", QuranContoller.fetchSurah);
// router.get("/quran/:edition", QuranContoller.getEdition);

export default router;
