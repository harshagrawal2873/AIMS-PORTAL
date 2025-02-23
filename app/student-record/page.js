"use client";

import { useEffect, useState } from "react";

const StudentRecordsPage = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentRecords = async () => {
      try {
        const response = await fetch("/api/student/records", {
          method: "GET",
          credentials: "include", // Send cookies with the request
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch student records");
        }

        const data = await response.json();
        setStudentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentRecords();
  }, []);

  if (loading) return <div className="text-center mt-20 text-gray-200">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  const { student, semesters, cgpa } = studentData;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <div className="max-w-5xl mx-auto bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-6 border-b border-gray-600 pb-3">Student Record</h1>
        <div className="mb-8">
          <p className="text-lg">
            <span className="font-semibold text-blue-400">Name:</span> {student.name}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-blue-400">Roll No:</span> {student.rollNo}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-blue-400">Email:</span> {student.email}
          </p>
        </div>

        {Object.keys(semesters).length > 0 ? (
          <>
            {Object.keys(semesters).map((semester) => {
              const { courses, totalCredits, sgpa } = semesters[semester];
              return (
                <div key={semester} className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-100 mb-4">
                    Semester {semester}
                  </h2>
                  <div className="border border-gray-700 rounded-lg p-4 bg-gray-700">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="border-b border-gray-600 p-2 text-blue-400">Course Name</th>
                          <th className="border-b border-gray-600 p-2 text-blue-400">Course Code</th>
                          <th className="border-b border-gray-600 p-2 text-blue-400">Credits</th>
                          <th className="border-b border-gray-600 p-2 text-blue-400">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course) => (
                          <tr key={course.courseId}>
                            <td className="p-2 border-b border-gray-600">{course.courseName}</td>
                            <td className="p-2 border-b border-gray-600">{course.courseCode}</td>
                            <td className="p-2 border-b border-gray-600">{course.courseCredit}</td>
                            <td className="p-2 border-b border-gray-600">{course.grade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4">
                      <p className="text-lg">
                        <span className="font-semibold text-blue-400">Total Credits:</span> {totalCredits}
                      </p>
                      <p className="text-lg">
                        <span className="font-semibold text-blue-400">SGPA:</span> {sgpa}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="mt-8">
              <h3 className="text-2xl font-bold text-blue-400">
                Total CGPA: <span className="text-gray-100">{cgpa}</span>
              </h3>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No records available</p>
        )}
      </div>
    </div>
  );
};

export default StudentRecordsPage;
