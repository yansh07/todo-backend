import express from "express";
import dotenv from "dotenv";
// import cors from "cors";
import connectDB from "./config/db.js";
import userAuthRoutes from "./routes/userAuth.js";  // only import from routes
// import Note from "./models/Note.js";
import noteRoutes from "./routes/noteRoutes.js"
import userRoutes from "./routes/user.js"
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();
const app = express();

//middleware
// app.use(
//   cors()
// );
app.use(express.json());

// routes
app.use("/api/user", userAuthRoutes);
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);

//profile pic
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
