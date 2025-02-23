"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const EnrollmentRequests = () => {
  const { user } = useAuth(); // Extract the logged-in user's information
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchEnrollmentRequests(user.id);
    }
  }, [user]);

  const fetchEnrollmentRequests = async (facultyAdvisorId) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`/api/faculty/get-enrollment-requests?facultyAdvisorId=${facultyAdvisorId}`);
      setEnrollments(response.data);
    } catch (err) {
      console.error("Error fetching enrollment requests:", err);
      setError("Failed to fetch enrollment requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollmentAction = async (courseId, studentId, status) => {
    try {
      const response = await axios.patch(`/api/faculty/enrollment/${courseId}/${studentId}`, {
        status,
      });

      if (response.status === 200) {
        alert(`Enrollment ${status} successfully.`);
        fetchEnrollmentRequests(user.id); // Refresh the list after action
      } else {
        alert(response.data.error || "Failed to process request.");
      }
    } catch (error) {
      console.error(`Error updating enrollment status: ${error}`);
      alert("An error occurred while updating the enrollment request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col w-9/10 mx-3 my-4 py-3 px-6 rounded-2xl items-center">
      <h1 className="text-4xl font-bold mb-6">Enrollment Requests</h1>

      {loading ? (
        <p className="text-gray-400">Loading enrollment requests...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : enrollments.length === 0 ? (
        <p className="text-gray-400">No pending enrollment requests.</p>
      ) : (
        <div className="w-full max-w-4xl">
          {enrollments.map((course) => (
            <div key={course.courseId} className="bg-gray-800 p-6 rounded-lg mb-4 shadow-md">
              <h2 className="text-2xl font-bold mb-2">{course.courseName} ({course.courseCode})</h2>
              {course.enrollments.map((student) => (
                <div key={student.studentId} className="bg-gray-700 p-4 rounded-md mb-2">
                  <p><strong>Name:</strong> {student.name}</p>
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>Roll Number:</strong> {student.rollNumber}</p>
                  <p><strong>Applied On:</strong> {new Date(student.appliedOn).toLocaleDateString()}</p>
                  <div className="mt-3 flex space-x-4">
                    <button
                      onClick={() => handleEnrollmentAction(course.courseId, student.studentId, "approved")}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleEnrollmentAction(course.courseId, student.studentId, "rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
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
