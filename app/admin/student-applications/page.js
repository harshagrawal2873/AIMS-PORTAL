"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EnrollmentRequests = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEnrollmentRequests();
  }, []);

  const fetchEnrollmentRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/api/admin/get-enrollment-requests");
      setEnrollments(response.data);
    } catch (err) {
      console.error("Error fetching enrollment requests:", err);
      setError("Failed to fetch enrollment requests. Please try again.");
      toast.error("Failed to fetch enrollment requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollmentAction = async (courseId, studentId, status) => {
    try {
      const response = await axios.patch(
        `/api/admin/enrollment/${courseId}/${studentId}`,
        { status }
      );

      if (response.status === 200) {
        toast.success(`Enrollment ${status} successfully.`);
        fetchEnrollmentRequests(); // Refresh the list after action
      } else {
        toast.error(response.data.error || "Failed to process request.");
      }
    } catch (error) {
      console.error(`Error updating enrollment status: ${error}`);
      toast.error("An error occurred while updating the enrollment request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-6 flex flex-col items-center">
      <ToastContainer />
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Enrollment Requests
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading enrollment requests...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : enrollments.length === 0 ? (
        <p className="text-gray-400">No pending enrollment requests.</p>
      ) : (
        <div className="w-full sm:w-9/10 lg:w-3/4 space-y-6">
          {enrollments.map((course) => (
            <div
              key={course.courseId}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transform transition duration-500"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                {course.courseName} ({course.courseCode})
              </h2>
              {course.enrollments.map((student) => (
                <div
                  key={student.studentId}
                  className="bg-gray-700 p-4 rounded-lg mb-4 shadow-md"
                >
                  <p className="text-lg">
                    <strong>Name:</strong> {student.name}
                  </p>
                  <p className="text-gray-300">
                    <strong>Email:</strong> {student.email}
                  </p>
                  <p className="text-gray-300">
                    <strong>Roll Number:</strong> {student.rollNumber}
                  </p>
                  <p className="text-gray-300">
                    <strong>Applied On:</strong>{" "}
                    {new Date(student.appliedOn).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() =>
                        handleEnrollmentAction(
                          course.courseId,
                          student.studentId,
                          "approved"
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleEnrollmentAction(
                          course.courseId,
                          student.studentId,
                          "rejected"
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrollmentRequests;
