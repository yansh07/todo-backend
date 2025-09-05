import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userAuthRoutes from "./routes/userAuth.js";
import noteRoutes from "./routes/noteRoutes.js"
import userRoutes from "./routes/user.js"
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// CORS must be BEFORE any routes
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://planitfirst.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5000',
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// routes
app.use("/api/user", userAuthRoutes);
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);

// profile pic
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connect
connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));