import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/user.js";
import path from "path";
import { fileURLToPath } from "url";

// --- 1. Basic Setup ---
dotenv.config();
const app = express();

// --- 2. The One and Only CORS Middleware ---
// This MUST be the very first `app.use`. No exceptions.
// The `cors` package is smart and handles the OPTIONS preflight request automatically.
const corsOptions = {
  origin: 'https://planitfirst.vercel.app',
  credentials: true,
};
app.use(cors(corsOptions));

// --- 3. Standard Body Parser ---
// This comes AFTER CORS.
app.use(express.json());

// --- 4. API Routes ---
// Your auth middleware is already inside these files, which is perfect.
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);

// --- 5. Static File Server (Optional) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 6. Database Connection ---
connectDB();

// --- 7. Root Route for Health Check ---
app.get("/", (req, res) => {
  res.send("Backend is alive and well! 🚀");
});

// --- 8. Final Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke on the server!');
});

// --- 9. Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅✅✅ Server is listening on port ${PORT}. The war is over. ✅✅✅`);
});