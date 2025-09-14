import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/user.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Middleware order is important!
app.use(express.json());

// Enhanced CORS middleware
app.use((req, res, next) => {
  const origin = 'https://planitfirst.vercel.app';
  
  // Log incoming requests for debugging
  console.log(`${req.method} ${req.url} from origin: ${req.headers.origin}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(204).end();
  }
  
  next();
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);

// Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
await connectDB();

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    status: 'healthy',
    cors: 'enabled',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
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

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
=== Server Started ===
🚀 Port: ${PORT}
🌍 CORS Origin: https://planitfirst.vercel.app
🔒 Environment: ${process.env.NODE_ENV}
===================
  `);
});