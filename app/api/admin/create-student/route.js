import { NextResponse } from "next/server";
import Student from "@/models/Student";
import Batch from "@/models/Batch";
import Professor from "@/models/Professor";
import { connectDB } from "@/utils/db";

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    console.log("Received data:", body);

    const { name, email, rollNumber, batch } = body;

   

    // Find batch by batch string
    console.log("Searching for batch with value:", batch.trim());
    const foundBatch = await Batch.findOne({ batch: batch.trim() });
    console.log("Batch found:", foundBatch);
    
    if (!batch) {
      return NextResponse.json({ message: "Batch not found" }, { status: 400 });
    }

    // Create new student record
    const newStudent = await Student.create({
      name,
      email,
      rollNumber,
      department:foundBatch.department,
      batch: foundBatch._id,
    });

    return NextResponse.json({ message: "Student created successfully", student: newStudent }, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ message: "Error creating student", error: error.message }, { status: 400 });
  }
}
