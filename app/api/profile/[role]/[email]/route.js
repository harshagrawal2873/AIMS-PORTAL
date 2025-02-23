import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Student from "@/models/Student";
import Professor from "@/models/Professor";
import Admin from "@/models/Admin";
import Batch from "@/models/Batch";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { role, email } = await params;

    if (!role || !email) {
      return NextResponse.json(
        { error: "Role and email are required." },
        { status: 400 }
      );
    }

    let userProfile;

    // Fetch data based on the role
    switch (role) {
      case "student":
        userProfile = await Student.findOne({ email }).populate("batch");
        console.log("individual items trying out here ::: ", userProfile.rollNumber);
    console.log("individual items trying out here ::: ", userProfile.phoneNumber);
    console.log("individual items trying out here ::: ", userProfile.batch?.department);
        break;
      case "professor":
        userProfile = await Professor.findOne({ email });
        break;
      case "admin":
        userProfile = await Admin.findOne({ email });
        break;
      default:
        return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    console.log("got this user profile ",userProfile);
    



    if (!userProfile) {
      return NextResponse.json(
        { error: `${role.charAt(0).toUpperCase() + role.slice(1)} not found.` },
        { status: 404 }
      );
    }

    // Return the relevant user profile information
    if (role === "student") {
      return NextResponse.json(
        {
          name: userProfile.name,
          email: userProfile.email,
          role: "student",
          phoneNumber: userProfile.phoneNumber || "N/A",
          rollNumber: userProfile.rollNumber || "N/A",
          department: userProfile.batch?.department || "N/A",
          sgpa: userProfile.sgpa || [],
          cgpa: userProfile.cgpa || "N/A",
          batch: userProfile.batch?.batch || "N/A",
          photo: userProfile.profilePic || "https://picsum.photos/203",
        },
        { status: 200 }
      );
    }

    if (role === "professor") {
      return NextResponse.json(
        {
          name: userProfile.name,
          email: userProfile.email,
          role: "professor",
          department: userProfile.department || "N/A",
          coursesTaught: userProfile.coursesTaught || [],
          photo: userProfile.profilePic || "https://picsum.photos/201",
        },
        { status: 200 }
      );
    }

    if (role === "admin") {
      return NextResponse.json(
        {
          name: userProfile.name,
          email: userProfile.email,
          role: "admin",
          photo: userProfile.profile || "https://picsum.photos/202",
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
