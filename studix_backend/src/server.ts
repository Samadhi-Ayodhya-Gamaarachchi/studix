import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db";
import authRoutes from "./routes/AuthRoutes";
import taskRoutes from "./routes/TaskRoutes";

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => res.send("Studix API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
