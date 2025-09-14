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

// --- 2. CORS Configuration ---
app.use((req, res, next) => {
  const origin = 'https://planitfirst.vercel.app';
  
  // Log request details
  console.log(`🚀 ${req.method} ${req.url} from origin: ${req.headers.origin}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS preflight');
    return res.status(204).end();
  }
  
  next();
});

// --- 3. Body Parser ---
app.use(express.json());

// --- 4. Health Check ---
app.get("/", (req, res) => {
  console.log('🏠 Root endpoint hit');
  res.json({ 
    message: "Server is alive! 🚀", 
    timestamp: new Date().toISOString() 
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// --- 5. API Routes ---
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);

// --- 6. Static Files ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 6.5 CORS Error Handler ---
app.use((err, req, res, next) => {
  if (err.message.includes('CORS')) {
    console.error('🚫 CORS Error:', {
      method: req.method,
      url: req.url,
      origin: req.headers.origin,
      error: err.message
    });
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed',
      details: err.message
    });
  }
  next(err);
});

// --- 7. Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('💥 GLOBAL ERROR:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// --- 8. 404 Handler ---
app.use((req, res) => {
  console.log('❌ 404:', req.method, req.url);
  res.status(404).json({ error: 'Route not found' });
});

// --- 9. Database Connection (with error handling) ---
try {
  await connectDB();
  console.log('✅ Database connected');
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  process.exit(1);
}

// --- 10. Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
});