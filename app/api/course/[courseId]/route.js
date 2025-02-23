import { connectDB } from "@/utils/db";
import Course from "@/models/Course";

export async function GET(req, { params }) {
  const { courseId } = await params;

  try {
    await connectDB();
    const course = await Course.findById(courseId)
      .populate("professor", "name")
      .populate("students.student", "rollNumber name");

    if (!course) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(course), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch course details" }),
      { status: 500 }
    );
  }
}
