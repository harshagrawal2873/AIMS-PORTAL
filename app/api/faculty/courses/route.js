import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connectDB } from "@/utils/db";

export async function GET(request) {
  await connectDB();

  try {
    console.log("Incoming request to fetch faculty courses...");

    // Extract the professor ID from headers (as middleware is setting it there)
    const professorId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    console.log("Extracted professorId:", professorId);
    console.log("Extracted userRole:", userRole);

    if (!professorId || userRole !== "professor") {
      console.error("Unauthorized access attempt.");
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Fetch courses for the professor
    const courses = await Course.find({ professor: professorId })
    .select("courseName courseCode courseCredit semesterOffered adminApproval status professor");

    console.log("Fetched courses:", courses);

    if (courses.length === 0) {
      console.warn("No courses found for professorId:", professorId);
    }

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
