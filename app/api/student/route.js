import { connectDB } from "@/utils/db";
import Student from "@/models/Student";

// GET request - Fetch all students
export async function GET(req) {
  await connectDB();
  const students = await Student.find({});
  return Response.json({ success: true, students });
}

// POST request - Create a new Student
export async function POST(req) {
  try {
    await connectDB();
    const { name, email, rollNumber, batch} = await req.json();
    const newStudent = new Student({ name, email, rollNumber, batch});
    await newStudent.save();
    return Response.json({ success: true, user: newStudent });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

