import { Router } from "express";
import {
  autoUpdateStreakDaily,
  changeStreak,
  createStreak,
  deleteStreak,
  getStreak,
  updateStreak,
} from "../controller/streak.controller.js";

const router = Router();

router.route("/").post(createStreak).get(getStreak);
router.route("/change-streak/:streakId").get(changeStreak);
router.route("/update/:streakId").patch(updateStreak);
// router.route("/translate").post(translateAndExplainQuote);
router.route("/delete").delete(deleteStreak);
router.route("/auto-update-daily").patch(autoUpdateStreakDaily);

export default router;
