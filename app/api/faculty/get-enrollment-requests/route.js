import { NextResponse } from "next/server";
import Course from "@/models/Course";
import Batch from "@/models/Batch";
import Student from "@/models/Student";
import { connectDB } from "@/utils/db";

export async function GET(request) {
  await connectDB();

  try {
    // Extract FA ID from query parameters
    const url = new URL(request.url);
    const facultyAdvisorId = url.searchParams.get("facultyAdvisorId");

    if (!facultyAdvisorId) {
      return NextResponse.json({ error: "Faculty Advisor ID is required" }, { status: 400 });
    }

    // Find batches assigned to the FA
    const batches = await Batch.find({ facultyAdvisor: facultyAdvisorId });

    if (!batches.length) {
      return NextResponse.json({ message: "No batches found for this Faculty Advisor" }, { status: 404 });
    }

    const batchIds = batches.map(batch => batch._id);

    // Find students in the FA's batches
    const students = await Student.find({ batch: { $in: batchIds } });
    const studentIds = students.map(student => student._id.toString());

    // Fetch courses with enrollment requests from these students
    const courses = await Course.find({ "students.student": { $in: studentIds } })
      .populate("students.student", "name email rollNumber")
      .select("courseName courseCode students");

    // Filter and format data for FA
    const filteredRequests = courses.map(course => ({
      courseId: course._id,
      courseName: course.courseName,
      courseCode: course.courseCode,
      enrollments: course.students
        .filter(s => studentIds.includes(s.student._id.toString()) && s.facultyAdvisorApproval === "pending")
        .map(s => ({
          studentId: s.student._id,
          name: s.student.name,
          email: s.student.email,
          rollNumber: s.student.rollNumber,
          appliedOn: s.appliedOn,
        }))
    })).filter(course => course.enrollments.length > 0);

    return NextResponse.json(filteredRequests);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
