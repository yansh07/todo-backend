import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/user.js";
import path from "path";
import { fileURLToPath } from "url";

// --- 1. Basic Setup ---
dotenv.config();
const app = express();

// --- 2. ENHANCED CORS MIDDLEWARE ---
app.use((req, res, next) => {
  console.log(`📡 ${req.method} request to ${req.url} from origin: ${req.headers.origin}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://planitfirst.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🚁 Handling preflight request');
    return res.status(200).end();
  }

  next();
});

// --- 3. Body Parser ---
app.use(express.json());

// --- 4. Test Route (Add this temporarily) ---
app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS is working!', timestamp: new Date().toISOString() });
});

// --- 5. API Routes ---
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);

// --- 6. Static Files ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.get("/", (req, res) => {
  res.send("Backend is alive. The demon is dead. 🚀");
});

// --- 7. Error Handler ---
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);
  res.status(500).json({ error: 'Something broke. But it was not CORS. I swear.' });
});

// --- 8. Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`🌍 CORS configured for: https://planitfirst.vercel.app`);
});