"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminApprovalRequests = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingCourses = async () => {
      try {
        const response = await axios.get("/api/admin/get-pending-courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching pending courses:", error);
        toast.error("Failed to fetch pending courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCourses();
  }, []);

  const handleApproveCourse = async (courseId) => {
    try {
      const response = await axios.put(`/api/admin/approve-course/${courseId}`);
      toast.success(response.data.message); // Show approval success message
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );
    } catch (error) {
      console.error("Error approving course:", error);
      toast.error("Failed to approve the course.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-6 flex flex-col items-center">
      <ToastContainer />
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Pending Course Requests
      </h1>
      {loading ? (
        <p className="text-gray-300">Loading pending courses...</p>
      ) : courses.length > 0 ? (
        <ul className="w-full sm:w-3/4 lg:w-1/2 space-y-6">
          {courses.map((course) => (
            <li
              key={course._id}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transform transition duration-500"
            >
              <h3 className="text-2xl font-semibold">{course.courseName}</h3>
              <p className="text-gray-400">Code: {course.courseCode}</p>
              <p>Credits: {course.courseCredit}</p>
              <p>
                Professor:{" "}
                <span className="text-gray-300">
                  {course.professor?.name || "Unknown"}
                </span>
              </p>
              <p className="text-yellow-400">Status: {course.adminApproval}</p>
              <button
                onClick={() => handleApproveCourse(course._id)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-300">No pending courses found.</p>
      )}
    </div>
  );
};

export default AdminApprovalRequests;
