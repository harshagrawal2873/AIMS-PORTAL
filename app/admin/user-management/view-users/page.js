"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ViewUser() {
  const [users, setUsers] = useState([]);
  const [batch, setBatch] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(false);
      setUsers([]); // Clear existing data when switching role

      try {
        const batchParam = searchParams.get("batch") || "";
        const departmentParam = searchParams.get("department") || "";
        const roleParam = searchParams.get("role") || role;

        const endpoint =
          roleParam === "student"
            ? `/api/admin/get-students?department=${departmentParam}&batch=${batchParam}`
            : `/api/admin/get-faculty?department=${departmentParam}`;

        const response = await axios.get(endpoint);

        if (response.status === 404) {
          setError(true);
        } else {
          setUsers(response.data.faculty || response.data.students || []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(true);
        toast.error("Error fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchParams, role]); // Re-fetch when role changes

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setUsers([]); // Clear old data immediately when switching tabs
  };

  const handleSearch = () => {
    let query = `/admin/user-management/view-users?department=${department}&role=${role}`;
    if (role === "student" && batch) {
      query += `&batch=${batch}`;
    }
    router.push(query);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-gray-800 shadow-xl rounded-2xl p-6 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          View {role === "student" ? "Students" : "Faculty"}
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {role === "student" && (
            <input
              type="text"
              placeholder="Enter Batch (e.g. 2023)"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
          <input
            type="text"
            placeholder="Enter Department (e.g. CSE)"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => handleRoleSwitch("student")}
            className={`px-6 py-2 rounded-l-lg transition duration-300 ${
              role === "student"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            View Students
          </button>
          <button
            onClick={() => handleRoleSwitch("faculty")}
            className={`px-6 py-2 rounded-r-lg transition duration-300 ${
              role === "faculty"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            View Faculty
          </button>
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300 w-full mb-4"
        >
          Search
        </button>

        {loading ? (
          <p className="text-center text-white">Loading users...</p>
        ) : error ? (
          <p className="text-center text-white">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-300 px-4 py-2 text-white">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-white">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-white">
                    Department
                  </th>
                  {role === "student" && (
                    <th className="border border-gray-300 px-4 py-2 text-white">Batch</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="text-center">
                      <td className="border border-gray-300 px-4 py-2 text-white">
                        {user.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-white">
                        {user.email}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-white">
                        {user.department}
                      </td>
                      {role === "student" && (
                        <td className="border border-gray-300 px-4 py-2 text-white">
                          {user.batch?.batch || "N/A"}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={role === "student" ? 4 : 3}
                      className="text-center text-gray-500 py-4"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
