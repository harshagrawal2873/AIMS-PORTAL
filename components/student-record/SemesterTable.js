import React from "react";

const calculateSGPA = (courses) => {
  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach(({ grade, credits }) => {
    const gradePoint =
      {
        A: 10,
        "A-": 9,
        B: 8,
        "B-": 7,
        C: 6,
        "C-": 5,
        D: 4,
        F: 0,
      }[grade] || 0;

    totalPoints += gradePoint * credits;
    totalCredits += credits;
  });

  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "N/A";
};

const SemesterTable = ({
  semesterNumber,
  courses,
  totalCredits,
  earnedCredits,
  cumulativeCGPA,
}) => {
  const sgpa = calculateSGPA(courses);

  return (
    <section className="w-full max-w-7xl bg-gray-800 rounded-2xl py-6 px-4 shadow-lg my-6 transform transition duration-500 hover:scale-105">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">
        Semester {semesterNumber}
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-gray-300">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-4 text-left">Course Name</th>
              <th className="py-2 px-4 text-center">Credits</th>
              <th className="py-2 px-4 text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="py-2 px-4 text-left">{course.name}</td>
                <td className="py-2 px-4 text-center">{course.credits}</td>
                <td className="py-2 px-4 text-center">{course.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-gray-300 mt-4 space-y-2 text-sm md:text-base">
        <p>
          <strong>SGPA:</strong> {sgpa}
        </p>
        <p>
          <strong>Credits Earned This Semester:</strong> {earnedCredits}
        </p>
        <p>
          <strong>Total Credits Earned:</strong> {totalCredits}
        </p>
        <p>
          <strong>CGPA (Up to Semester {semesterNumber}):</strong>{" "}
          {cumulativeCGPA}
        </p>
      </div>
    </section>
  );
};

export default SemesterTable;
