"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const StudentGrading = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grades, setGrades] = useState({});
  const [editMode, setEditMode] = useState({}); // Tracks edit state for individual students
  const params = useParams();
  const id = params?.id; // Extract course ID

  useEffect(() => {
    console.log("id is " + id)
    if (!id) return;

    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/admin/result-management/students/${id}`);
        const data = await response.json();
        if (response.ok) {
          setStudents(data.students);

          const initialGrades = data.students.reduce((acc, student) => {
            acc[student.student] = student.grade || "";
            return acc;
          }, {});
          setGrades(initialGrades);

          const isGraded = data.students.some((student) => student.grade !== "N/A");
          setEditMode(isGraded);
        } else {
          setError(data.error || "Failed to fetch students");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [id]);

  const handleGradeChange = (studentId, grade) => {
    setGrades((prev) => ({ ...prev, [studentId]: grade }));
  };

  const handleSubmitGrades = async () => {
    try {
      const response = await fetch(`/api/admin/result-management/submit-grades/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grades }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Grades submitted successfully!");
        setEditMode({}); // Reset edit state
      } else {
        alert(`Failed to submit grades: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 font-semibold">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Grade Students
      </h1>
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <ul className="space-y-4">
          {students.map((student) => (
            <li
              key={student.student}
              className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition rounded-lg p-4 shadow-sm"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{student.name}</h2>
                <p className="text-gray-600">Roll Number: {student.rollNumber}</p>
              </div>
              {editMode[student.student] ? (
                <select
                  value={grades[student.student] || ""}
                  onChange={(e) => handleGradeChange(student.student, e.target.value)}
                  className="border rounded-lg px-4 py-2 text-gray-800 w-32"
                >
                  <option value="" disabled>
                    Select Grade
                  </option>
                  {["A", "A-", "B", "B-", "C", "C-", "D", "E", "F"].map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex gap-2 items-center">
                  <span className="text-lg">{grades[student.student]}</span>
                  <button
                    onClick={() =>
                      setEditMode((prev) => ({
                        ...prev,
                        [student.student]: true,
                      }))
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1 px-2 rounded-lg"
                  >
                    Edit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={handleSubmitGrades}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
        >
          Submit Grades
        </button>
        <Link
          href="/admin/result-management"
          className="mt-4 block text-center text-blue-600 hover:text-blue-700"
        >
          Back to Course List
        </Link>
      </div>
    </div>
  );
};

export default StudentGrading;
