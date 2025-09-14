import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";

dotenv.config();
const app = express();

const allowed = ["https://planitfirst.vercel.app", "http://localhost:5173"];
app.use(cors({ origin: allowed, credentials: true }));

app.use(express.json());

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 8080;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
