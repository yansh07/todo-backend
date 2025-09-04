import Note from "../models/Note.js";

// Profile (example)
export const getProfile = async (req, res) => {
  try {
    res.json(req.user); // middleware se user aaya hai
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get notes for logged in user
export async function getNotes(req, res) {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create note
export async function createNote(req, res) {
  try {
    const { title, category, content } = req.body;

    const note = await Note.create({
      userId: req.user._id,
      title,
      category,   // frontend se category aa rahi hai (jaise template me hai)
      content,
    });

    res.status(201).json({ message: "Note created", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete note
export async function deleteNote(req, res) {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
