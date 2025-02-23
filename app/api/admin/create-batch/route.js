import { NextResponse } from "next/server";
import Batch from "@/models/Batch";
import Professor from "@/models/Professor";
import { connectDB } from "@/utils/db";

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    console.log("Received data:", body);

    const { batch, department, facultyEmail } = body;

    // Find the professor by email
    const facultyAdvisor = await Professor.findOne({ email: facultyEmail });

    if (!facultyAdvisor) {
      return NextResponse.json({ message: "Faculty advisor not found" }, { status: 404 });
    }

    // Check if the batch already exists
    const existingBatch = await Batch.findOne({ batch, department });
    if (existingBatch) {
      return NextResponse.json({ message: "Batch already exists" }, { status: 400 });
    }

    // Create new batch with faculty's ObjectId
    const newBatch = await Batch.create({
      batch,
      department,
      facultyAdvisor: facultyAdvisor._id,
    });

    return NextResponse.json(
      { message: "Batch created successfully", batch: newBatch },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating batch", error: error.message },
      { status: 400 }
    );
  }
}
