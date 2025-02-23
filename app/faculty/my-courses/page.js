'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/faculty/courses', {
          withCredentials: true, // Include cookies in the request
        });

        if (response.data) {
          setCourses(response.data);
        } else {
          toast.error('No courses found!');
        }
      } catch (error) {
        toast.error(
          'Error fetching courses: ' + (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-gray-800 shadow-xl rounded-2xl p-6 md:p-10 w-full max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
          My Courses
        </h1>
        {loading ? (
          <p className="text-white text-center">Loading courses...</p>
        ) : courses.length > 0 ? (
          <ul className="space-y-4">
            {courses.map((course) => (
              <li
                key={course._id}
                className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gray-700"
              >
                <h3 className="text-xl font-semibold text-white">
                  Name: {course.courseName}
                </h3>
                <p className="text-gray-300">Code: {course.courseCode}</p>
                <p className="text-gray-300">Credits: {course.courseCredit}</p>
                <p>
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      course.adminApproval === 'approved'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {course.adminApproval}
                  </span>
                </p>
                <button
                  onClick={() => router.push(`/courses/${course._id}`)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
