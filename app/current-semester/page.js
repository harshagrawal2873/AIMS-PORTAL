"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // Import the custom hook to access user context
import CourseTable from "@/components/current-semester/CourseTable";

const CurrentSemesterPage = () => {
  const { user } = useAuth(); // Retrieve the user data (which includes studentId)
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return; // Prevent fetching if the user data is not available

    const fetchCourses = async (id) => {
      try {
        const response = await fetch(`/api/student/courses?studentId=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses(user.id); // Pass the studentId from the context
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        <p className="text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16">
      <h1 className="text-3xl md:text-4xl font-bold my-6 text-center">
        Current Semester
      </h1>

      {courses.length > 0 ? (
        <CourseTable courses={courses} currentStudentId={user.id} />
      ) : (
        <p className="text-gray-400 text-center text-lg">
          No courses enrolled yet.
        </p>
      )}
    </div>
  );
};

export default CurrentSemesterPage;
