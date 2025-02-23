import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connectDB } from "@/utils/db";

export async function GET(request) {
  await connectDB();
  try {
    // Fetch courses with adminApproval status set to "pending"
    const pendingCourses = await Course.find({ adminApproval: "pending" })
      .select("courseName courseCode courseCredit professor adminApproval requestedOn")
      .populate("professor","name email");

    return NextResponse.json(pendingCourses);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
