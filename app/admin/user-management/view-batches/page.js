"use client";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ViewBatches() {
  const [batch, setBatch] = useState("");
  const [department, setDepartment] = useState("");
  const [facultyEmail, setFacultyEmail] = useState("");
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const query = new URLSearchParams({
      ...(batch && { batch }),
      ...(department && { department }),
      ...(facultyEmail && { facultyEmail }),
    }).toString();

    try {
      const response = await axios.get(`/api/admin/get-batch?${query}`);
      if (response.status === 200) {
        setBatches(response.data.batches || []);
      } else {
        setBatches([]);
      }
    } catch (error) {
      toast.error("Error fetching batches.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-gray-800 shadow-xl rounded-2xl p-6 md:p-10 w-full max-w-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
          View Batches
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Batch (e.g. 2023)"
            className="input-field"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Department"
            className="input-field"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <input
            type="email"
            placeholder="Faculty Email"
            className="input-field"
            value={facultyEmail}
            onChange={(e) => setFacultyEmail(e.target.value)}
          />
        </div>

        <button
          onClick={handleSearch}
          className={`submit-btn ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search Batches"}
        </button>

        <div className="mt-6">
          {batches.length > 0 ? (
            <ul className="batch-list">
              {batches.map((b) => (
                <li key={b._id} className="batch-card">
                  <p className="batch-title">Batch: {b.batch}</p>
                  <p className="batch-detail">Department: {b.department}</p>
                  <p className="batch-detail">
                    Faculty Advisor: {b.facultyAdvisor.name} ({b.facultyAdvisor.email})
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-white">No batches found.</p>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .input-field {
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background-color: #fff;
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

        .batch-list {
          list-style: none;
          padding: 0;
        }

        .batch-card {
          padding: 12px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-bottom: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .batch-title {
          font-weight: bold;
          font-size: 18px;
        }

        .batch-detail {
          font-size: 16px;
          color: #555;
        }

        @media (min-width: 768px) {
          .input-field {
            flex: 1;
          }

          .submit-btn {
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}
