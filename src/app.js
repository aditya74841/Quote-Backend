import express from "express";
import { createServer } from "http";
import cors from "cors";
const app = express();

const httpServer = createServer(app);

app.use(
  cors({
    origin: ["*"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // configure static file to save images locally

import quoteRouter from "../src/routes/quote.routes.js";
import streakRouter from "../src/routes/streak.routes.js";

app.use("/api/v1/quote", quoteRouter);
app.use("/api/v1/streak", streakRouter);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server is running perfectly" });
});
app.get("/health-check", (req, res) => {
  return res
    .status(200)
    .json({ message: "Health Check completed  Server is running perfectly" });
});
export { httpServer };
