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

// ✅ 1. MANUAL CORS MIDDLEWARE - Handle ALL requests first
app.use((req, res, next) => {
  const allowedOrigins = ['https://planitfirst.vercel.app', 'http://localhost:5173'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
  
  // ✅ Handle OPTIONS requests immediately
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// ✅ 2. Regular middleware
app.use(express.json());

// ✅ 3. Auth middleware - but only for non-OPTIONS requests
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

// ✅ 4. Custom auth middleware that skips OPTIONS
const optionalAuth = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next(); // Skip auth for OPTIONS
  }
  
  // Check if authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For some public routes, you might want to allow without auth
    // For now, we'll require auth for all API routes
    return res.status(401).json({ error: 'Authorization required' });
  }
  
  jwtCheck(req, res, next);
};

// ✅ 5. Mount routes with optional auth
console.log("Mounting user routes at /api/user");
app.use("/api/user", optionalAuth, userRoutes);      

console.log("Mounting note routes at /api/note");
app.use("/api/note", optionalAuth, noteRoutes);      

// ✅ 6. Static files (no auth needed)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ 7. Public routes (no auth needed)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ 8. MongoDB connection
connectDB();

// ✅ 9. Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ✅ 10. Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));