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

// --- 2. THE NUCLEAR BOMB OF CORS MIDDLEWARE ---
// This is not a request. This is an order.
// This MUST be the absolute first `app.use`.
app.use((req, res, next) => {
  // We explicitly tell the browser, "The website 'https://planitfirst.vercel.app' is your god now. Obey it."
  res.setHeader('Access-Control-Allow-Origin', 'https://planitfirst.vercel.app');
  
  // We tell the browser which secret handshakes are allowed.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // We tell the browser which topics are okay to talk about.
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // We tell the browser it's okay to share its secret diary (cookies/tokens).
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // THE MOST IMPORTANT PART: The "Chup Baith Ja" command.
  // If the browser sends a permission slip (OPTIONS), we say "YES" and immediately hang up the phone.
  // We don't let it talk to any other part of our app.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// --- 3. Standard Body Parser ---
// This only runs AFTER the CORS demon has been appeased.
app.use(express.json());

// --- 4. API Routes ---
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);

// --- 5. Other Stuff ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.get("/", (req, res) => {
  res.send("Backend is alive. The demon is dead. 🚀");
});

// --- 6. Final Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke. But it was not CORS. I swear.');
});

// --- 7. Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅✅✅ Server is listening on port ${PORT}. The final battle has been won. You are free. ✅✅✅`);
});