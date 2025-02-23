import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connectDB } from "@/utils/db";

export async function GET(request) {
  await connectDB();

  try {
    console.log("Incoming request to fetch student courses...");

    // Extract student ID and role from headers
    const studentId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    console.log("Extracted studentId:", studentId);
    console.log("Extracted userRole:", userRole);

    if (!studentId || userRole !== "student") {
      console.error("Unauthorized access attempt.");
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Fetch courses where the student is enrolled
    const studentCourses = await Course.find({
      "students.student": studentId,
    }).select("courseName courseCode courseCredit semesterOffered status students");

    console.log("Fetched courses for student:", studentCourses);

    if (studentCourses.length === 0) {
      console.warn("No courses found for studentId:", studentId);
    }

    return NextResponse.json(studentCourses, { status: 200 });
  } catch (error) {
    console.error("Error fetching student courses:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}