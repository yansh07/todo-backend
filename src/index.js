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

// Define CORS options
const corsOptions = {
  origin: 'https://planitfirst.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
};

// --- 1. CORS Configuration ---
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsOptions.origin);
  res.header('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
  res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// --- 2. Debug middleware ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// --- 3. YOUR API ROUTES ---
// The auth middleware is already inside these route files, which is perfect.
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);

// Add this before your API routes
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS is working',
    origin: req.headers.origin,
    method: req.method
  });
});

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

// Process error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// --- 7. START SERVER ---
const startServer = async () => {
  try {
    // Validate required environment variables
    const requiredEnvVars = ['PORT', 'MONGODB_URI', 'NODE_ENV'];
    const missingVars = requiredEnvVars.filter(key => !process.env[key]);
    
    if (missingVars.length) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Connect to MongoDB first
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected');

    // Start Express server
    const PORT = process.env.PORT || 8080;
    const server = app.listen(PORT, () => {
      console.log(`
=== Server Started ===
🚀 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
🔒 CORS Origin: ${corsOptions.origin}
==================
      `);
    });

    // Add server error handler
    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
};

// Add this after your imports
const validateEnv = () => {
  const required = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI
  };

  console.log('Environment variables:');
  Object.entries(required).forEach(([key, value]) => {
    console.log(`${key}: ${value ? '✅' : '❌'}`);
  });
};

// Add this right before startServer()
validateEnv();

startServer();