import { NextResponse } from "next/server";
import Course from "@/models/Course";
import Student from "@/models/Student";
import { connectDB } from "@/utils/db";

export async function POST(request) {
  await connectDB();
  try {
     // Extract role and user ID from headers (added by middleware)
     const userRole = request.headers.get('x-user-role');
     const studentId = request.headers.get('x-user-id');
 
     if (userRole !== 'student') {
       return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
     }
 
    // const { studentId, courseId } = await request.json();
    const { courseId } = await request.json();


    // Validate input
    if (!studentId || !courseId) {
      return NextResponse.json({ error: "Student ID and Course ID are required" }, { status: 400 });
    }

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check if the course exists and is approved
    const course = await Course.findById(courseId);
    if (!course || course.adminApproval !== "approved") {
      return NextResponse.json({ error: "Course not found or not approved" }, { status: 404 });
    }

    // Check if student is already enrolled or has a pending request
    const existingEnrollment = course.students.find(
      (s) => s.student.toString() === studentId
    );
    if (existingEnrollment) {
      return NextResponse.json({ error: "Enrollment request already exists" }, { status: 400 });
    }

    // Add the enrollment request
    course.students.push({ student: studentId, enrollmentStatus: "pending" });
    await course.save();

    return NextResponse.json({ message: "Enrollment request submitted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
