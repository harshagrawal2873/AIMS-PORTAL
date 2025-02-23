
import { connectDB } from "@/utils/db";
import {Professor}  from "@/models/Professor";

// GET request - Fetch all professors
export async function GET(req) {
  await connectDB();
  const professor = await Professor.find({});
  return Response.json({ success: true, professor });
}

// POST request - Create a new professor
export async function POST(req) {
  try {
    await connectDB();
    const { name, email } = await req.json();
    const newPorfessor = new Professor({ name, email });
    await newPorfessor.save();
    return Response.json({ success: true, professor: newPorfessor });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

