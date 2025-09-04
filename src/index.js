import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userAuth.js";  // only import from routes
// import Note from "./models/Note.js";
import noteRoutes from "./routes/noteRoutes.js"

dotenv.config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes)

// MongoDB connect
connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
