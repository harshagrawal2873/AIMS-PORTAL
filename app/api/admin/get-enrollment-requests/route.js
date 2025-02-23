import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connectDB } from "@/utils/db";

export async function GET() {
  await connectDB();

  try {
    // Fetch courses with pending enrollment requests
    const pendingEnrollments = await Course.find({ "students.enrollmentStatus": "pending" })
      .populate("students.student", "name email rollNumber")
      .select("courseName courseCode students");

    const formattedData = pendingEnrollments.map((course) => ({
      courseId: course._id,
      courseName: course.courseName,
      courseCode: course.courseCode,
      enrollments: course.students
        .filter((s) => s.enrollmentStatus === "pending")
        .map((s) => ({
          studentId: s.student._id,
          name: s.student.name,
          email: s.student.email,
          rollNumber: s.student.rollNumber,
          appliedOn: s.appliedOn,
        })),
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
