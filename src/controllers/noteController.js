import Note from "../models/Note.js";
import User from "../models/User.js"; 

// 🔹 Helper function: find user by Auth0 ID
const getUserFromAuth = async (auth0Id) => {
  return await User.findOne({ auth0Id });
};

// 📌 Create new note
export const createNote = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const auth0Id = req.auth.sub; // directly middleware se

    const user = await getUserFromAuth(auth0Id);
    if (!user) return res.status(404).json({ error: "User profile not found." });

    const newNote = await Note.create({
      title,
      category,
      content,
      user: user._id,
    });

    res.status(201).json({ message: "Note created successfully", note: newNote });
  } catch (err) {
    console.error("❌ Error creating note:", err);
    res.status(500).json({ error: "Server error while creating note." });
  }
};

// 📌 Get all notes for logged-in user
export const getNotes = async (req, res) => {
  try {
    const auth0Id = req.auth.sub;
    const user = await getUserFromAuth(auth0Id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const notes = await Note.find({ user: user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("❌ Error fetching notes:", err);
    res.status(500).json({ error: "Server error while fetching notes." });
  }
};

// 📌 Search notes by title or category
export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;
    const auth0Id = req.auth.sub;

    const user = await getUserFromAuth(auth0Id);
    if (!user) return res.status(404).json({ error: "User not found" });

    let notes;
    if (!query || query.trim() === "") {
      notes = await Note.find({ user: user._id }).sort({ createdAt: -1 });
    } else {
      const searchRegex = new RegExp(query.trim(), "i");
      notes = await Note.find({
        user: user._id,
        $or: [
          { title: { $regex: searchRegex } },
          { category: { $regex: searchRegex } },
        ],
      }).sort({ createdAt: -1 });
    }

    res.json(notes);
  } catch (err) {
    console.error("❌ Error searching notes:", err);
    res.status(500).json({ error: "Server error while searching notes." });
  }
};

// 📌 Update note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const auth0Id = req.auth.sub;

    const user = await getUserFromAuth(auth0Id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, user: user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    res.json({ message: "Note updated successfully", note: updatedNote });
  } catch (err) {
    console.error("❌ Error updating note:", err);
    res.status(500).json({ error: "Server error while updating note." });
  }
};

// 📌 Delete note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const auth0Id = req.auth.sub;

    const user = await getUserFromAuth(auth0Id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const note = await Note.findOneAndDelete({ _id: id, user: user._id });
    if (!note) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting note:", err);
    res.status(500).json({ error: "Server error while deleting note." });
  }
};
