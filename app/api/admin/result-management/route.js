import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connectDB } from "@/utils/db";

export async function GET() {
  await connectDB();
  try {
    const courses = await Course.find({adminApproval: "approved"}, "courseName courseCode"); // Fetch only necessary fields
    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
