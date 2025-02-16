import { httpServer } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "./.env" });

const startServer = () => {
  httpServer.listen(process.env.PORT || 8080, () => {
    console.log("⚙️  Server is running on port: " + process.env.PORT);
  });
};

startServer();

connectDB();
