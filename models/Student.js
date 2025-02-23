import mongoose  from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true ,index: true},
  rollNumber: { type: String, required: true, unique: true , index :true },
  department: {type: String , index: true},
  profilePic: { type: String },
  phoneNumber: { 
    type: String, 
    default: "", 
    validate: {
      validator: function(v) {
        return v === "" || /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },  
  // courses: [
  //   {
  //     course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  //     grade: { type: String, default: "N/A" },
  //     semester: { type: Number },
  //     enrollmentStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
  //   },
  // ],
  sgpa: [{ semester: Number, sgpa: { type: Number, min: 0, max: 10 } }],
  cgpa: { type: Number, min: 0, max: 10 },
  batch : { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true }
}, { timestamps: true });

const Student = mongoose.models.Student || mongoose.model("Student", StudentSchema);
export default Student;
