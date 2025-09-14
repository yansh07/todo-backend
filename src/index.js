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

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['https://planitfirst.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

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

// First mount all routes
console.log("Mounting user routes at /api/user");
app.use("/api/user", jwtCheck, userRoutes);      

console.log("Mounting note routes at /api/note");
app.use("/api/note", jwtCheck, noteRoutes);      

// Then add debug logging AFTER routes are mounted
const printRoutes = (app) => {
  console.log("\n=== API Routes ===");
  app._router?.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      const methods = Object.keys(middleware.route.methods);
      console.log(`${methods.join(',')} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods);
          const path = handler.route.path;
          console.log(`${methods.join(',')} ${path}`);
        }
      });
    }
  });
};

// Call it after mounting all routes
printRoutes(app);

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

// Add this before error handlers
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));