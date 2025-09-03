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
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;

// usage - signup
// const newUser = new User({ fullName, email, password });
// await newUser.save();

// login
// const user = await User.findOne({ email });
// if (!user) throw new Error("User not found");

// then compare hashed password
