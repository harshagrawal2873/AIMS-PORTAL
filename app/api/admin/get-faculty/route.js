import { connectDB } from "@/utils/db";
import Professor from "@/models/Professor";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const department = searchParams.get("department");

    let query = {};
    if (department) query.department = department;

    const faculty = await Professor.find(query).select("-__v");
    return NextResponse.json({ success: true, faculty });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
