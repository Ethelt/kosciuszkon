import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { addConfigRoutes } from "./config";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

addConfigRoutes(app)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
