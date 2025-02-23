const CourseTable = ({ courses, currentStudentId }) => {
  return (
    <section className="w-full max-w-7xl bg-gray-800 rounded-2xl py-6 px-4 shadow-lg my-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Current Semester Courses
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-gray-300">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-4 text-left">Course Name</th>
              <th className="py-2 px-4 text-center">Credits</th>
              <th className="py-2 px-4 text-center">Semester</th>
              <th className="py-2 px-4 text-center">Enrollment Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => {
              // Check if course.students is defined and is an array
              const students = Array.isArray(course.students)
                ? course.students
                : [];

              const enrollment = students.find(
                (s) => String(s.student) === String(currentStudentId)
              );

              return (
                <tr
                  key={course._id || index}
                  className="border-b border-gray-700"
                >
                  <td className="py-2 px-4 text-left">{course.courseName}</td>
                  <td className="py-2 px-4 text-center">
                    {course.courseCredit}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {course.semesterOffered}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span
                      className={`py-1 px-3 rounded-xl font-semibold ${
                        enrollment?.enrollmentStatus === "approved"
                          ? "bg-green-500 text-white"
                          : enrollment?.enrollmentStatus === "pending"
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {enrollment?.enrollmentStatus || "NA"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CourseTable;
