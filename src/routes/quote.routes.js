import { Router } from "express";
import {
  explainQuoteInEnglish,
  getAllQuotes,
  getTodayQuote,
  storeQuote,
  translateQuoteToHindi,
} from "../controller/quote.controller.js";

const router = Router();

router.route("/create-quote").get(storeQuote);
router.route("/today").get(getTodayQuote);
router.route("/all").get(getAllQuotes);
// router.route("/translate").post(translateAndExplainQuote);
router.route("/translate").post(translateQuoteToHindi);
router.route("/explain").post(explainQuoteInEnglish);

export default router;
