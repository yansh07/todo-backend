import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

// signup - logic
export async function userSignup(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ fullName, email, password: hashedPassword });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Signup successful",
      token,
    });
  } catch (err) {
    console.error("❌ Signup error:", err); // <-- yeh add kar
    return res.status(500).json({ error: err.message });
  }
}


// LOGIN - logic
export async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
