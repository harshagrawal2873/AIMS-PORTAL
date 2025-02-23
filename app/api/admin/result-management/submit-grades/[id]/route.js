import Course from "@/models/Course";
import { connectDB } from "@/utils/db";

export async function PUT(request, { params }) {
  const { id } = await params;

  try {
    await connectDB();
    const { grades } = await request.json();

    const course = await Course.findById(id);

    if (!course) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
      });
    }

    course.students.forEach((student) => {
      if (grades[student.student.toString()]) {
        student.grade = grades[student.student.toString()];
      }
    });

    await course.save();

    return new Response(
      JSON.stringify({ message: "Grades updated successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
