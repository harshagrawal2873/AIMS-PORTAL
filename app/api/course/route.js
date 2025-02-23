import { connectDB } from "@/utils/db";
import Course from "@/models/Course";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// GET request - Fetch all course
export async function GET(req) {
  await connectDB();
  const courses = await Course.find({});
  return Response.json({ success: true, courses });
}

export async function POST(req) {
  try {
    await connectDB();
    const token = cookies().get("authToken").value;
    if (!token) {
      return new Response(JSON.stringify({ error: "authorization token missing" }), { status: 401 });
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded.role)
    if (decoded.role !== "professor") {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    const { courseName, courseCode, courseCredit } = await req.json();
    const newCourse = new Course({
      courseName,
      courseCode,
      courseCredit,
      professor: decoded.id,  // Use decoded professor ID from token
    });
    await newCourse.save();

    return new Response(JSON.stringify({ success: true, course: newCourse }), { status: 201 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }


}