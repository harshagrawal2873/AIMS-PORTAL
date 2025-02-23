import { NextResponse } from "next/server";
import Course from "@/models/Course";
import connectDB from "@/utils/db";

export async function GET(req) {
  await connectDB();
  try {
    const courses = await Course.find().populate("professor students.student");
    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching courses", error: error.message }, { status: 500 });
  }
}
