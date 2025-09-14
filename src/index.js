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
const whitelist = ['https://planitfirst.vercel.app', 'http://localhost:5173'];

const corsOptions = {
  origin: [
    "https://planitfirst.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true
};


// Apply CORS first
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// --- 2. STANDARD MIDDLEWARE ---
// This comes AFTER CORS.
app.use(express.json());

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

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
  console.error('Error:', {
    message: err.message,
    origin: req.headers.origin,
    path: req.path,
    method: req.method
  });
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: `Origin ${req.headers.origin} not allowed`
    });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// --- 7. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`>>> SERVER IS ALIVE AND WELL ON PORT ${PORT} <<<`));