"use client";

import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseCredit, setCourseCredit] = useState("");
  const [semesterOffered, setSemesterOffered] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/faculty/create-course", {
        courseName,
        courseCode,
        courseCredit,
        semesterOffered,
      });
      toast.success(response.data.message);
      setCourseName("");
      setCourseCode("");
      setCourseCredit("");
      setSemesterOffered("");
    } catch (error) {
      toast.error(
        "Error creating course: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-gray-800 shadow-xl rounded-2xl p-6 md:p-10 w-full max-w-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
          Create New Course
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Course Name"
            className="input-field"
            required
          />
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            placeholder="Course Code"
            className="input-field"
            required
          />
          <input
            type="number"
            value={courseCredit}
            onChange={(e) => setCourseCredit(e.target.value)}
            placeholder="Course Credit"
            className="input-field"
            required
          />
          <input
            type="text"
            value={semesterOffered}
            onChange={(e) => setSemesterOffered(e.target.value)}
            placeholder="Semester Offered"
            className="input-field"
            required
          />

          <button
            type="submit"
            className={`submit-btn ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Create Course"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .input-field {
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background-color: #1f2937;
          color: white;
          transition: border-color 0.3s ease;
        }

        .input-field:focus {
          border-color: #4f46e5;
          outline: none;
        }

        .submit-btn {
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
          background-color: #4338ca;
        }
      `}</style>
    </div>
  );
};

export default CreateCourse;
