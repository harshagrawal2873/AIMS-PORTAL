import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type: String,
        required : true,
        unique : true
    },
    profile : {
        type : String
    }
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
export default Admin 