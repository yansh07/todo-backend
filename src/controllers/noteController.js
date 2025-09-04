import Note from "../models/Note.js";

// 📌 Create new note
export const createNote = async (req, res) => {
  try {
    const { heading, description, label } = req.body;

    const note = await Note.create({
      heading,
      description,
      label,
      user: req.user._id, // ✅ middleware se mila user
    });

    res.status(201).json({ message: "Note created successfully", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Get all notes for logged-in user
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Update note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndUpdate(
      { _id: id, user: req.user._id }, // ✅ sirf apna hi note update kar paaye
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json({ message: "Note updated", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Delete note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
