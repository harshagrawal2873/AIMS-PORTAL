"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "@/components/courses/CourseCard";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allCourses, setAllCourses] = useState([]); // Store all courses for filtering
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [creditedCourses, setCreditedCourses] = useState([]); // Store credited course IDs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchCourses();
    fetchCreditedCourses(); // Fetch the credited courses on page load
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/api/student/get-approved-courses");
      setAllCourses(response.data);
      setFilteredCourses(response.data);
    } catch (err) {
      setError("Failed to fetch courses.");
      toast.error("Failed to fetch courses.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreditedCourses = async () => {
    try {
      const response = await axios.get("/api/student/get-credited-courses");
      const creditedCourseIds = response.data.map((course) => course._id);
      setCreditedCourses(creditedCourseIds);
    } catch (err) {
      console.error("Failed to fetch credited courses:", err);
      toast.error("Failed to fetch credited courses.");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase().trim();
    setSearchQuery(query);

    if (query === "") {
      setFilteredCourses(allCourses);
    } else {
      const filtered = allCourses.filter((course) =>
        course.name.toLowerCase().includes(query)
      );
      setFilteredCourses(filtered);
    }
  };

  const handleCredit = async (courseId) => {
    try {
      const response = await axios.post("/api/student/enroll-request", {
        courseId,
      });

      if (response.status === 200) {
        toast.success(
          `Credit request sent successfully for course ID: ${courseId}. Awaiting admin approval.`
        );
        fetchCreditedCourses();
      } else {
        toast.error(`Failed to send request: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error sending credit request:", error);
      toast.error(
        "An error occurred while sending the request. Please try again."
      );
    }
  };

  const handleViewDetails = (courseId) => {
    router.push(`/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col w-full mx-auto py-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 items-center">
      <h1 className="text-4xl font-bold mb-6 text-center">Search Courses</h1>

      <div className="w-full max-w-2xl mb-6">
        <input
          type="text"
          className="w-full bg-gray-800 text-white py-2 px-4 rounded-xl"
          placeholder="Search for courses..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p className="text-gray-400">Loading courses...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredCourses.length === 0 ? (
        <p className="text-gray-400">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              hasCredited={creditedCourses.includes(course._id)}
              onCredit={() => handleCredit(course._id)}
              onViewDetails={() => handleViewDetails(course._id)}
            />
          ))}
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default CoursesPage;
