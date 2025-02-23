import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    // Get cookies from Next.js cookie store
    const cookieStore = await cookies();
    const token = await cookieStore.get("authToken");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token found" }, { status: 401 });
    }

    // Verify and decode JWT
    const secretKey = process.env.JWT_SECRET; // Ensure JWT_SECRET is set in .env
    const decoded = jwt.verify(token.value, secretKey);

    // Extract relevant user data from the token
    const { email, id, role } = decoded;

    return NextResponse.json({
      success: true,
      user: { email, id, role },
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
