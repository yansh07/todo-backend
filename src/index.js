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
app.use(cors({
  origin: [
    'https://planitfirst.vercel.app',
    'http://localhost:5000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.options("*", cors());

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

// Protected routes
console.log("Mounting user routes at /api/user");
app.use("/api/user", jwtCheck, userRoutes);      

console.log("Mounting note routes at /api/note");
app.use("/api/note", jwtCheck, noteRoutes);      

// Public route should be last
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MongoDB connect
connectDB();

// Log errors and request path
app.use((err, req, res, next) => {
  console.error('Path:', req.path);
  console.error('Error:', err);
  next(err);
});

// Error handling for auth
app.use((err, req, res, next) => {
  console.error('Auth Error Details:', {
    path: req.path,
    error: err.message,
    stack: err.stack
  });
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));