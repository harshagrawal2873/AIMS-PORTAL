"use client";
import { useState } from "react";

export default function CreateBatch() {
  const [batch, setBatch] = useState("");
  const [department, setDepartment] = useState("");
  const [facultyEmail, setFacultyEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/create-batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch, department, facultyEmail }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Batch created successfully!");
      setBatch("");
      setDepartment("");
      setFacultyEmail("");
    } else {
      setMessage(`Error: ${data.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-900">
      <div className="bg-gray-800 shadow-xl rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Create Batch
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Batch (e.g. 2023)"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-400"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Department"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-green-400"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Faculty Advisor Email"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-400"
            value={facultyEmail}
            onChange={(e) => setFacultyEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Batch"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center mt-4 font-semibold ${
              message.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
