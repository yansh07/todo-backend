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
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

// Protected routes
app.use("/api/user", jwtCheck, userRoutes);      
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

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));