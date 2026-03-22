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

//**********************************|| DAILY PLSN MGMT ||***************************************//
router.post("/planner", authMiddleware as any, DailyPlanController.myDailyPlan);

//**************************************|| QURAN MANAGEMENT ||**************************//
// router.get("/surah/:surahNumber", QuranContoller.fetchSurah);
// router.get("/quran/:edition", QuranContoller.getEdition);

export default router;
