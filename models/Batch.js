import mongoose from "mongoose"

const BatchSchema = new mongoose.Schema({
    batch : {type: String,unique : true, required: true}, // this feild we are keeping unique to link with the student uniquely 
    department : {type: String, required: true},
    facultyAdvisor: { type: mongoose.Schema.Types.ObjectId, ref: "Professor" }
},{ timestamps: true })

const Batch = mongoose.models.Batch || mongoose.model("Batch", BatchSchema);
export default Batch;