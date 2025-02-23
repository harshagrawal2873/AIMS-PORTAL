import { NextResponse } from "next/server";
import Batch from "@/models/Batch";
import { connectDB } from "@/utils/db";

export async function GET(request, { params }) {
  const { facultyId } = params;

  await connectDB();

  try {
    const isAdvisor = await Batch.exists({ facultyAdvisor: facultyId });
    
    return NextResponse.json({ isAdvisor: Boolean(isAdvisor) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
