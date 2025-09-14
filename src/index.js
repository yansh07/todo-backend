import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();

// ✅ CORS config
const allowedOrigins = [
  "https://planitfirst.vercel.app",  
  "http://localhost:5173"            
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"]     
  })
);

// Body parser
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);

// DB connect + server start
const PORT = process.env.PORT || 8080;
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
