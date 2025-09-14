import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/user.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

app.use((req, res, next) => {
  // We explicitly set the ONLY allowed origin.
  res.setHeader('Access-Control-Allow-Origin', 'https://planitfirst.vercel.app');
  
  // We set the allowed methods.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // We set the allowed headers.
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // We allow credentials.
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);

// --- 5. Other Stuff ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.get("/", (req, res) => {
  res.send("Backend is alive. CORS has been defeated. 🚀");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅✅✅ Server listening on port ${PORT}. The curse is broken. You are free. ✅✅✅`);
});