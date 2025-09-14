import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";

dotenv.config();
const app = express();

const allowedOrigin = "https://planitfirst.vercel.app";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.options(
  "*",
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
