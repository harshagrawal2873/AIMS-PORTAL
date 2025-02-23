import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connectDB } from "@/utils/db";

export async function GET(request) {
  await connectDB();

  try {
    // Extract role and user ID from headers (added by middleware)
    const userRole = request.headers.get("x-user-role");
    const studentId = request.headers.get("x-user-id");

    // Ensure only students can access this route
    if (userRole !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Validate the student ID
    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Fetch courses where the student has been approved
    const creditedCourses = await Course.find({
      "students.student": studentId,
      "students.enrollmentStatus": "approved",
    }).select("_id courseName courseCode courseCredit");

    // Return the credited courses
    return NextResponse.json(creditedCourses);
  } catch (error) {
    console.error("Error fetching credited courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
