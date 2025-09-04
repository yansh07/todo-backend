import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "general",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // 🔑 har note ek user ka hoga
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
