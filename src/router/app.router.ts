import express from "express";
import { QuranContoller } from "../controller/quran.controllers";

const router = express.Router();

router.get("/surah/:surahNumber", QuranContoller.fetchSurah);
router.get("/quran/:edition", QuranContoller.getEdition);

export default router;
