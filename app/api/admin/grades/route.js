import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connectDB } from "@/utils/db";


export async function PUT(request) {
    await connectDB();
    try {
      const { courseId } = request.query;
      const { grades } = await request.json();
      const course = await Course.findById(courseId);
      grades.forEach(({ studentId, grade }) => {
        const student = course.students.find((s) => s.student.toString() === studentId);
        if (student) student.grade = grade;
      });
      await course.save();
      return NextResponse.json({ message: "Grades submitted successfully" });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
  