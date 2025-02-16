import { Router } from "express";
import {
  getAllQuotes,
  getTodayQuote,
  storeQuote,
} from "../controller/quote.controller.js";

const router = Router();

router.route("/create-quote").get(storeQuote);
router.route("/today").get(getTodayQuote);
router.route("/all").get(getAllQuotes);

export default router;
