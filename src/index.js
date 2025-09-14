import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/user.js";
import path from "path";
import { fileURLToPath } from "url";

// --- 1. CONFIG ---
dotenv.config();
const app = express();

// --- 1. Enhanced CORS Configuration ---
const corsOptions = {
  origin: ['https://planitfirst.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests
app.options('*', cors(corsOptions));

// --- 2. STANDARD MIDDLEWARE ---
// This comes AFTER CORS.
app.use(express.json());

// --- 3. YOUR API ROUTES ---
// The auth middleware is already inside these route files, which is perfect.
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);

// --- 5. OTHER STUFF ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// --- 4. Enhanced Error Handler ---
app.use((err, req, res, next) => {
  console.error('Error details:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    error: err.message
  });
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// --- 7. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`>>> SERVER IS ALIVE AND WELL ON PORT ${PORT} <<<`));