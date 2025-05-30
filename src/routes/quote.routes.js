import { Router } from "express";
import {
  getAllQuotes,
  getTodayQuote,
  storeQuote,
  translateAndExplainQuote,
} from "../controller/quote.controller.js";

const router = Router();

router.route("/create-quote").get(storeQuote);
router.route("/today").get(getTodayQuote);
router.route("/all").get(getAllQuotes);
router.route("/translate").post(translateAndExplainQuote);

export default router;
