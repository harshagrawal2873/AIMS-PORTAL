"use client";

import { useEffect, useState } from "react";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/course");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data.courses);  // Assuming API returns { courses: [...] }
        console.log("data:: "+data)
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle course approval
  const handleApprove = async (courseId) => {
    try {
      const response = await fetch("http://localhost:3000/api/course/changeStatus", {
        method: "PATCH",
        headers: {

          "Content-Type": "application/json",
        },
        credentials : "include",
        body: JSON.stringify({ courseId }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Course approved successfully!");

        // Update UI by setting adminApproval to true
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === courseId ? { ...course, adminApproval: true } : course
          )
        );
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error approving course:", error);
      alert("Failed to approve course");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading courses...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Course List</h1>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500">No courses available.</p>
      ) : (
        <div className="grid gap-6">
          {courses.map((course) => (
            <div key={course._id} className="border p-4 rounded shadow-md bg-gray-100 dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {course.courseName}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Code: {course.courseCode}</p>
              <p className="text-gray-600 dark:text-gray-400">Credits: {course.courseCredit}</p>

              {!course.adminApproval ? (
                <button
                  onClick={() => handleApprove(course._id)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Approve
                </button>
              ) : (
                <span className="mt-4 text-green-600 font-medium">Approved</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
