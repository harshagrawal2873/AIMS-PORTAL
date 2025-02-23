import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connectDB } from "@/utils/db";

export async function GET(request) {
  await connectDB();
  try {
    const search = request.nextUrl.searchParams.get("search")?.trim().toLowerCase() || "";

    let query = { adminApproval: "approved" };

    if (search) {
      query.$or = [
        { courseName: { $regex: search, $options: "i" } },  // Match course name
        { courseCode: { $regex: search, $options: "i" } }   // Match course code
      ];
    }

    const approvedCourses = await Course.find(query).select("courseName courseCode courseCredit");

    return NextResponse.json(approvedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
