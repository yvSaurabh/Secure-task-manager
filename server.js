
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouts from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import taskRoutes from "./routes/taskRoutes.js";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";


dotenv.config();
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("Connected to MongoDB"))
.catch((err)=> console.log("Mongodb Error", err));

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "client")));

app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true
}));
app.use(cookieParser());
app.use("/api/auth", authRouts);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API Running.");
});

import { protect } from "./middlewares/authMiddleware.js";

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

