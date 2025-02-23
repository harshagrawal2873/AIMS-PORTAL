'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('/api/faculty/student-applications');
        setApplications(response.data);
      } catch (error) {
        toast.error('Error fetching applications: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleDecision = async (id, status) => {
    try {
      await axios.post('/api/faculty/student-applications/decision', { id, status });
      setApplications((prev) => prev.filter((app) => app.id !== id));
      toast.success(`Application ${status}`);
    } catch (error) {
      toast.error('Error updating application: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-gray-800 shadow-xl rounded-2xl p-6 md:p-10 w-full max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
          Student Applications
        </h1>
        {loading ? (
          <p className="text-white text-center">Loading applications...</p>
        ) : applications.length > 0 ? (
          <ul className="space-y-4">
            {applications.map((app) => (
              <li
                key={app.id}
                className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gray-700"
              >
                <p className="text-white font-semibold">Name: {app.studentName}</p>
                <p className="text-gray-300">Course: {app.courseTitle}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleDecision(app.id, 'approved')}
                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(app.id, 'rejected')}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white text-center">No applications pending.</p>
        )}
      </div>
    </div>
  );
};

export default StudentApplications;
