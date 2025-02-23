import { connectDB } from "@/utils/db"; // Database connection utility
import Student from "@/models/Student"; // Student model
import Course from "@/models/Course"; // Course model
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET; // Add your JWT secret key in environment variables

// Helper function to calculate grade points based on grades
const getGradePoint = (grade) => {
  const gradeMap = {
    A: 10,
    "A-": 9,
    B: 8,
    "B-": 7,
    C: 6,
    "C-": 5,
    D: 4,
    E: 2,
    F: 0,
    "N/A": 0, // Default for courses without grades
  };
  return gradeMap[grade] || 0;
};

// GET request handler
export async function GET(req) {
  try {
    await connectDB(); // Ensure database connection

    // Extract the JWT from cookies
    const token = await req.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token missing" },
        { status: 401 }
      );
    }

    // Verify and decode the JWT
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 403 }
      );
    }

    const studentId = decodedToken.id;

    // Fetch the student record
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // Fetch all courses the student is enrolled in
    const enrolledCourses = await Course.find({
      "students.student": studentId,
      "students.enrollmentStatus": "approved",
    });

    // Organize data semester-wise
    const semesters = {};
    let totalCreditsEarned = 0;
    let totalGradePoints = 0;

    enrolledCourses.forEach((course) => {
      const enrollment = course.students.find(
        (enrollment) =>
          enrollment.student.toString() === studentId &&
          enrollment.enrollmentStatus === "approved"
      );

      if (!enrollment) {
        console.warn(
          `No valid enrollment found for course: ${course.courseName}`
        );
        return; // Skip this course if no valid enrollment
      }

      const { semesterOffered, courseName, courseCode, courseCredit, _id } =
        course;
      const grade = enrollment.grade || "N/A";
      const gradePoint = getGradePoint(grade);

      if (!semesters[semesterOffered]) {
        semesters[semesterOffered] = {
          courses: [],
          totalCredits: 0,
          totalPoints: 0,
        };
      }

      semesters[semesterOffered].courses.push({
        courseId: _id,
        courseName,
        courseCode,
        courseCredit,
        grade,
      });

      semesters[semesterOffered].totalCredits += courseCredit;
      semesters[semesterOffered].totalPoints += gradePoint * courseCredit;

      totalCreditsEarned += courseCredit;
      totalGradePoints += gradePoint * courseCredit;
    });

    // Calculate SGPA for each semester
    Object.keys(semesters).forEach((semester) => {
      const { totalCredits, totalPoints } = semesters[semester];
      semesters[semester].sgpa = totalCredits
        ? (totalPoints / totalCredits).toFixed(2)
        : "N/A";
    });

    // Calculate CGPA
    const cgpa = totalCreditsEarned
      ? (totalGradePoints / totalCreditsEarned).toFixed(2)
      : "N/A";

    console.log(student);

    // Return the response
    return NextResponse.json({
      student: {
        name: student.name,
        rollNo: student.rollNumber,
        email: student.email,
      },
      semesters,
      cgpa,
    });
  } catch (error) {
    console.error("Error fetching student records:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
