import mongoose from "mongoose";

const ProfessorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePic: { type: String },
  department: { type: String, required: true },
  coursesTaught: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
}, { timestamps: true });                                                           

export const Professor = mongoose.models.Professor || mongoose.model("Professor", ProfessorSchema);
export default Professor;