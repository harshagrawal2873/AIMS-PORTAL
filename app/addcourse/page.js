// only for testing the api
"use client";
import { useState } from "react";

export default function CourseForm() {
  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    courseCredit: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",  // Important to send cookies with the request
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Course added successfully!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center bg-gray-900 p-6 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-left">Course Name:</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block text-left">Course Code:</label>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block text-left">Course Credit:</label>
          <input
            type="number"
            name="courseCredit"
            value={formData.courseCredit}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700">
          Submit Course
        </button>
      </form>
    </div>
  );
}
