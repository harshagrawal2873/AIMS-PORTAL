import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connectDB } from "@/utils/db";

export async function PATCH(request, { params }) {
  const { courseId, studentId } = params;
  const { status } = await request.json(); // Expected status: "approved" or "rejected"

  await connectDB();

  try {
    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const studentEnrollment = course.students.find((s) => s.student.toString() === studentId);
    if (!studentEnrollment) {
      return NextResponse.json({ error: "Enrollment request not found" }, { status: 404 });
    }

    studentEnrollment.enrollmentStatus = status;
    if (status === "approved") {
      studentEnrollment.approvedOn = new Date();
    }

    await course.save();

    return NextResponse.json({ message: `Enrollment ${status} successfully.` });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
