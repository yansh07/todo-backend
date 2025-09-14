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

// --- 2. NUCLEAR CORS MIDDLEWARE (FIRST THING!) ---
app.use((req, res, next) => {
  console.log(`🚀 INCOMING: ${req.method} ${req.url} from ${req.headers.origin || 'no-origin'}`);
  
  // Allow ALL origins temporarily for debugging
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ PREFLIGHT handled');
    return res.status(204).end();
  }
  
  console.log('📤 Headers set, continuing...');
  next();
});

// --- 3. Body Parser ---
app.use(express.json());

// --- 4. Test Route ---
app.get('/api/test-cors', (req, res) => {
  console.log('🧪 Test CORS endpoint hit');
  res.json({ 
    message: 'CORS IS WORKING!', 
    timestamp: new Date().toISOString(),
    origin: req.headers.origin 
  });
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
  res.send("🔥 NUCLEAR CORS DEPLOYED 🔥");
});

// --- 7. Error Handler ---
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', err.message);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// --- 8. Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 NUCLEAR CORS SERVER ON PORT ${PORT}`);
});