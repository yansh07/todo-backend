import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String, // Cloudinary ka image URL
    default: "", 
  },
  bio: {
    type: String, 
    maxlength: 150, // word limit 150 words
    default: "",
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
