import Course from "@/models/Course";
import Student from "@/models/Student";
import { connectDB } from "@/utils/db";

export async function GET(request, { params }) {
  const courseId = await params.id
  console.log("Params: "+ params)
  try {
    await connectDB();
    console.log("coures Id is "+courseId)
    const course = await Course.findById(courseId).populate({
      path: "students.student",
      select: "name rollNumber",
    });

    if (!course) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
      });
    }

    const students = course.students.map((s) => ({
      student: s.student._id,
      name: s.student.name,
      rollNumber: s.student.rollNumber,
      grade: s.grade || "N/A",
    }));

    return new Response(JSON.stringify({ students }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
