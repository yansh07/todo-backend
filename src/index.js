import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/user.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// --- 1. Basic Setup ---
dotenv.config();
const app = express();

// --- 2. Basic Middleware ---
app.use(express.json());

// --- 3. CORS Configuration ---
const corsConfig = {
  origin: 'https://planitfirst.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsConfig));

// Handle preflight requests
app.options('*', (req, res) => {
  console.log(`Handling OPTIONS request from: ${req.headers.origin}`);
  res.status(204).send();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// --- 4. Health Check ---
app.get("/", (req, res) => {
  console.log('🏠 Root endpoint hit');
  res.json({ 
    message: "Server is alive! 🚀", 
    timestamp: new Date().toISOString() 
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// --- 5. API Routes ---
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);

// --- 6. Static Files ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 7. Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    path: req.path
  });
});

// --- 8. Graceful Shutdown ---
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

// --- 9. Database Connection (with error handling) ---
try {
  await connectDB();
  console.log('✅ Database connected');
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  process.exit(1);
}

// --- 10. Start Server ---
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});