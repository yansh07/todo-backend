import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from "./routes/user.js"; 

dotenv.config();

const app = express();

// CORS setup
app.use(cors({
  origin: "https://planitfirst.vercel.app", 
  credentials: true,                       
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parser
app.use(express.json());
app.use("/api/user", userRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB connected");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
