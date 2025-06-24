
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const swaggerDocument = YAML.load(path.resolve(__dirname, "./swagger.yaml"));

swaggerDocument.servers = [
  {
    url: process.env.FREEAPI_HOST_URL || "https://quote-backend-xqfm.onrender.com/api/v1",
  },
];

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none", // keep all the sections collapsed by default
    },
    customSiteTitle: "Special App Docs",
  })
);




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
