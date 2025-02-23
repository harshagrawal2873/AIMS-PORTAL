import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  courseCredit: {type: Number, required: true},
  professor: { type: mongoose.Schema.Types.ObjectId, ref: "Professor", required: true }, // Created by Professor
  adminApproval: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  requestedOn: { type: Date, default: Date.now },
  approvedOn: { type: Date },
  semesterOffered: { type: Number },
  students : [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      enrollmentStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      grade: { type: String, default: "N/A" } , // Default until grades are assigned
      appliedOn: { type: Date, default: Date.now },
      approvedOn: { type: Date },
      facultyAdvisorApproval: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
    }
  ],
  status: {
    type: String,
    enum: ["pending", "open for enrollment", "in progress", "completed"],
    default: "pending",
  },
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
export default Course;

