'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseDetails = ({ params }) => {
  const { courseId } = params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`/api/course/${courseId}`);
      setCourse(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch course details.');
      toast.error('Failed to fetch course details!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-white text-center">Loading course details...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!course) {
    return <p className="text-white text-center">Course not found.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-gray-800 shadow-xl rounded-2xl p-6 md:p-10 w-full max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">{course.courseName}</h1>
        <p className="text-xl text-white mb-4">Course Code: {course.courseCode}</p>
        <p className="text-xl text-white mb-4">Credits: {course.courseCredit}</p>
        <p className="text-xl text-white mb-4">Course Status: {course.status}</p>
        <p className="text-xl text-white mb-4">Professor: {course.professor.name}</p>
        <p className="text-xl text-white mb-4">Semester: {course.semesterOffered}</p>

        <h2 className="text-2xl font-bold text-white mt-6 mb-4">Enrolled Students</h2>
        {course.students.length === 0 ? (
          <p className="text-white">No students enrolled yet.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 px-4 py-2 text-white">Student Name</th>
                <th className="border border-gray-700 px-4 py-2 text-white">Student Roll Number</th>
                <th className="border border-gray-700 px-4 py-2 text-white">Enrollment Status</th>
              </tr>
            </thead>
            <tbody>
              {course.students.map((student) => (
                <tr key={student.student._id} className="text-center">
                  <td className="border border-gray-700 px-4 py-2 text-white">{student.student.name}</td>
                  <td className="border border-gray-700 px-4 py-2 text-white">{student.student.rollNumber}</td>
                  <td className="border border-gray-700 px-4 py-2 text-white">{student.enrollmentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
