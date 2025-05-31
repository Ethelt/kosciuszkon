import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { shared } from "@arabska/shared/src/index";
import { addConfigRoutes } from "./config";
import { addTasksRoutes } from "./tasks";
import { worker, Worker } from "./dispatcher/Worker";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: shared });
});

addConfigRoutes(app);
addTasksRoutes(app);

// start worker
worker.start();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
