import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Course from '@/models/Course';

export async function POST(req) {
  await connectDB();

  try {
    // Extract role and user ID from headers (added by middleware)
    const userRole = req.headers.get('x-user-role');
    const userId = req.headers.get('x-user-id');

    if (userRole !== 'professor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { courseName, courseCode, courseCredit, semesterOffered } = await req.json();

    if (!courseName || !courseCode || !courseCredit) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check for duplicate course code
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return NextResponse.json({ message: 'Course code already exists' }, { status: 400 });
    }

    const newCourse = new Course({
      courseName,
      courseCode,
      courseCredit,
      professor: userId,
      adminApproval: 'pending',
      semesterOffered,
      status: 'pending',
    });

    await newCourse.save();

    return NextResponse.json({ message: 'Course request submitted successfully', course: newCourse }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
