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

// Check for required environment variables
const requiredEnvVars = [
  'AUTH0_AUDIENCE',
  'AUTH0_ISSUER_BASE_URL',
  'PORT'
];

const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Single CORS configuration
const corsOptions = {
  origin: [
    'https://planitfirst.vercel.app',
    'http://localhost:5000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());

// profile pic
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Auth middleware
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE || '',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || '',
  tokenSigningAlg: 'RS256'
});

// Add debug logging for routes
app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
        console.log("Route path:", r.route.path)
    }
});

// Add this before mounting routes
const debugRoutes = (prefix, router) => {
  router.stack.forEach(layer => {
    if (layer.route) {
      const path = prefix + layer.route.path;
      const methods = Object.keys(layer.route.methods);
      console.log(`Route: ${methods.join(',')} ${path}`);
    }
  });
};

// Protected routes
console.log("Mounting user routes at /api/user");
app.use("/api/user", jwtCheck, userRoutes);      
debugRoutes("/api/user", userRoutes);

console.log("Mounting note routes at /api/note");
app.use("/api/note", jwtCheck, noteRoutes);      
debugRoutes("/api/note", noteRoutes);

// Public route should be last
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MongoDB connect
connectDB();

// Log errors and request path
app.use((err, req, res, next) => {
  console.error('Request Details:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      error: 'Authentication failed',
      details: err.message 
    });
  }
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));