import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/user.js";
import path from "path";
import { fileURLToPath } from "url";

// --- 1. Basic Setup ---
dotenv.config();
const app = express();

// --- 2. CORS Configuration ---
const corsOptions = {
  origin: 'https://planitfirst.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// --- 3. Body Parser ---
app.use(express.json());

// --- 4. API Routes ---
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);

// --- 5. Static Files ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.get("/", (req, res) => {
  res.send("Backend is alive. CORS is handled properly. 🚀");
});

// --- 6. Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke. But CORS is fine.' });
});

// --- 7. Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`🌍 CORS enabled for: https://planitfirst.vercel.app`);
});