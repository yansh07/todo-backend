import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userAuth.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);

// MongoDB connect
connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
