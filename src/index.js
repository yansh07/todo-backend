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

// ✅ FIXED CORS CONFIGURATION - Add OPTIONS method and more headers
app.use(cors({
  origin: ['https://planitfirst.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json());

// ✅ REMOVE THE PROBLEMATIC ROUTE DEBUGGING CODE
// Delete this entire section:
// const printRoutes = (app) => {
//   console.log("\n=== API Routes ===");
//   app._router?.stack.forEach((middleware) => {
//     if (middleware.route) {
//       // Routes registered directly on the app
//       const methods = Object.keys(middleware.route.methods);
//       console.log(`${methods.join(',')} ${middleware.route.path}`);
//     } else if (middleware.name === 'router') {
//       // Router middleware
//       middleware.handle.stack.forEach((handler) => {
//         if (handler.route) {
//           const methods = Object.keys(handler.route.methods);
//           const path = handler.route.path;
//           console.log(`${methods.join(',')} ${path}`);
//         }
//       });
//     }
//   });
// };

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

// Mount routes
console.log("Mounting user routes at /api/user");
app.use("/api/user", jwtCheck, userRoutes);      

console.log("Mounting note routes at /api/note");
app.use("/api/note", jwtCheck, noteRoutes);      

// ✅ SIMPLE ROUTE LOGGING INSTEAD
console.log("\n=== API Routes ===");
console.log("POST /api/user/verify-user");
console.log("POST /api/user/auth0-login"); 
console.log("GET /api/user/profile");
console.log("PUT /api/user/profile");
console.log("POST /api/note/");
console.log("GET /api/note/");
console.log("GET /api/note/search");
console.log("PUT /api/note/:id");
console.log("DELETE /api/note/:id");
console.log("==================\n");

// Public route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MongoDB connect
connectDB();

// ✅ REORDER MIDDLEWARE - Request logging should come first
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