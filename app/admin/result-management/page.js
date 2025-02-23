"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ResultManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/admin/result-management");
        const data = await response.json();
        if (response.ok) {
          setCourses(data.courses);
        } else {
          setError(data.error || "Failed to fetch courses");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 font-semibold">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Result Management
      </h1>
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <ul className="space-y-4">
          {courses.map((course) => (
            <li
              key={course._id}
              className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition rounded-lg p-4 shadow-sm"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {course.courseName}
                </h2>
                <p className="text-gray-600">Code: {course.courseCode}</p>
              </div>
              <Link
                href={`/admin/result-management/${course._id}/`}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
              >
                Grade
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultManagement;
