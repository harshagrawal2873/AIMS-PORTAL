import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connectDB } from "@/utils/db";

export async function PUT(request, { params }) {
  const { courseId } = params;

  await connectDB();

  try {
    // Find the course by its ID
    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    // Check if the course is already approved or rejected
    if (course.adminApproval !== "pending") {
      return NextResponse.json(
        { message: "Course has already been approved or rejected" },
        { status: 400 }
      );
    }

    // Update the course's adminApproval status to "approved"
    course.adminApproval = "approved";
    course.status = "open for enrollment";
    course.approvedOn = new Date(); // Set approval timestamp

    await course.save();

    return NextResponse.json({
      message: "Course approved successfully",
      course,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
