import { connectDB } from "@/utils/db";
import Admin from "@/models/Admin";

// GET request - Fetch all admins
export async function GET(req) {
  await connectDB();
  const admin = await Admin.find({});
  return Response.json({ success: true, admin });
}

// POST request - Create a new admin
export async function POST(req) {
  try {
    await connectDB();
    const { name, email} = await req.json();
    const newAdmin = new Admin({ name, email});
    await newAdmin.save();
    return Response.json({ success: true, admin: newAdmin });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

