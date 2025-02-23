import { connectDB } from "@/utils/db";
import Student from "@/models/Student";
import Batch from "@/models/Batch"; 

export async function GET(req) {
  try {
    await connectDB();

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const batchName = searchParams.get("batch");
    const department = searchParams.get("department");

    let query = {};

    // Handle batch filtering
    if (batchName) {
      const batchDoc = await Batch.findOne({ batch: batchName });
      console.log("fetched batch ", batchDoc)
      if (!batchDoc) {
        return Response.json({ success: false, error: "Batch not found" }, { status: 404 });
      }
      query["batch"] = batchDoc._id;  // Use the ObjectId of the found batch
    }

    // Handle department filtering
    if (department) query["department"] = department;

    // Fetch students with populated batch field
    const students = await Student.find(query)
      .populate("batch", "batch")  // Populate batch field with only batch name
      .select("-__v");

    return Response.json({ success: true, students });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}