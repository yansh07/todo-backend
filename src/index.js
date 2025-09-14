import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import userRoutes from "./routes/user.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://planitfirst.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.set("trust proxy", 1);
app.use(express.json());
app.options("*", cors());

// ✅ Routes
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 8080;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
