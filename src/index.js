console.log(">>> INDEX.JS RUNNING: LATEST VERSION - GHOSTBUSTER DEPLOY <<<");
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import noteRoutes from "./routes/noteRoutes.js"
import userRoutes from "./routes/user.js"
import path from "path";
import { fileURLToPath } from "url";
import { auth } from 'express-oauth2-jwt-bearer';

dotenv.config();
const app = express();

// ✅ 1. Handle OPTIONS requests FIRST (before auth middleware)
app.options('*', cors({
  origin: ['https://planitfirst.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
}));

// ✅ 2. Add manual CORS headers for all responses
app.use((req, res, next) => {
  const allowedOrigins = ['https://planitfirst.vercel.app', 'http://localhost:5173'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
  next();
});

// ✅ 3. Regular CORS middleware
app.use(cors({
  origin: ['https://planitfirst.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
}));

app.use(express.json());

// profile pic
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Auth middleware
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

// ✅ 4. Create auth middleware that skips OPTIONS requests
const authUnlessOptions = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next(); // Skip auth for OPTIONS requests
  }
  jwtCheck(req, res, next);
};

// Mount routes with the modified auth middleware
console.log("Mounting user routes at /api/user");
app.use("/api/user", authUnlessOptions, userRoutes);      

console.log("Mounting note routes at /api/note");
app.use("/api/note", authUnlessOptions, noteRoutes);      

// Public route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MongoDB connect
connectDB();

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error handlers
app.use((err, req, res, next) => {
  console.error('Error Details:', {
    method: req.method,
    path: req.path,
    errorName: err.name,
    errorMessage: err.message
  });
  
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));