import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notesdb";

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected:", uri.includes("localhost") ? "Local DB" : "Atlas/Prod DB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
