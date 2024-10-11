import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  addByAdmin: { type: Boolean, default: false },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // Référence à l'utilisateur (User)
    ref: "User", // Nom de la collection User
    required: true, // Chaque tâche doit avoir un propriétaire
  },
});

export default mongoose.model("Task", taskSchema);
