import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/user.js";
import path from "path";
import { fileURLToPath } from "url";

// --- 1. CONFIG ---
dotenv.config();
const app = express();

// --- 2. THE ONLY CORS SETUP YOU WILL EVER NEED ---
// This must be the VERY FIRST middleware. Before anything else.
const corsOptions = {
  origin: 'https://planitfirst.vercel.app', // Only allow your Vercel app
  credentials: true,
};
app.use(cors(corsOptions));

// --- 3. STANDARD MIDDLEWARE ---
// This comes AFTER CORS.
app.use(express.json());

// --- 4. YOUR API ROUTES ---
// The auth middleware is already inside these route files, which is perfect.
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);

// --- 5. OTHER STUFF ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// --- 6. ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --- 7. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`>>> SERVER IS ALIVE AND WELL ON PORT ${PORT} <<<`));