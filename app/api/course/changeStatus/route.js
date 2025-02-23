import { connectDB } from "@/utils/db";
import Course from "@/models/Course";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PATCH(req) {
  try {
    await connectDB();
    const token = cookies().get("authToken").value;
    if (!token) {
      return new Response(JSON.stringify({ error: "authorization token missing" }), { status: 401 });
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded.role)
    if (decoded.role !== "admin") {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }
    const body = await req.json();
    console.log(body)
    const {courseId} = body;

    console.log(courseId)
    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { adminApproval: true },
        { new: true } // Return the updated document
    );
    if (!updatedCourse) {
        return Response.json({ error: "Course not found" }, { status: 404 });
    }
    
    return Response.json({ message: "Enrollment status updated successfully", course: updatedCourse }, { status: 200 });

  } catch (error) {
    console.log("Error updating enrollement section", error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }


}