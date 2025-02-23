import { NextResponse } from "next/server";
import Professor from "@/models/Professor";
import {connectDB} from "@/utils/db";

export async function POST(req) {
  await connectDB();
  try {
    const { name, email, department } = await req.json();

    const newProfessor = await Professor.create({ name, email, department });
    return NextResponse.json({ message: "Faculty created successfully", professor: newProfessor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating faculty", error: error.message }, { status: 400 });
  }
}
