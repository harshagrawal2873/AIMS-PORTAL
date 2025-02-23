import { connectDB } from "@/utils/db";
import Batch from "@/models/Batch";
import Professor from "@/models/Professor";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const batch = searchParams.get("batch");
    const department = searchParams.get("department");
    const facultyEmail = searchParams.get("facultyEmail");

    // Build dynamic query
    let query = {};

    if (batch) query["batch"] = batch;
    if (department) query["department"] = department;

    // If faculty email is provided, fetch the faculty's ObjectId
    if (facultyEmail) {
      const faculty = await Professor.findOne({ email: facultyEmail });

      if (!faculty) {
        return Response.json({ success: false, message: "Faculty not found" }, { status: 404 });
      }

      query["facultyAdvisor"] = faculty._id;
    }

    // Fetch batches based on the constructed query
    const batches = await Batch.find(query)
      .populate("facultyAdvisor", "name email")
      .select("-__v");
     console.log("these are the results :: --> ",batches);
    return Response.json({ success: true, batches });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
