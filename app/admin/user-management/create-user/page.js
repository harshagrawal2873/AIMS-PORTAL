"use client";

import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateUser = () => {
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [batch, setBatch] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let userData = { name, email };

    if (userType === "student") {
      userData = { ...userData, rollNumber, batch };
    } else if (userType === "faculty") {
      userData = { ...userData, department };
    }

    try {
      if (userType === "student") {
        await axios.post("/api/admin/create-student", userData);
        toast.success("Student created successfully!");
      } else {
        await axios.post("/api/admin/create-faculty", userData);
        toast.success("Faculty created successfully!");
      }

      // Reset the form
      setEmail("");
      setName("");
      setPhone("");
      setRollNumber("");
      setDepartment("");
      setBatch("");
    } catch (error) {
      toast.error(
        `Error creating user: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-gray-800 shadow-xl rounded-2xl p-6 md:p-10 w-full max-w-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
          Create {userType === "student" ? "Student" : "Faculty"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input-field"
            required
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="input-field"
            required
          />

          {userType === "student" && (
            <>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Roll Number"
                className="input-field"
                required
              />
              <input
                type="text"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder="Batch"
                className="input-field"
                required
              />
            </>
          )}

          {userType === "faculty" && (
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Department"
              className="input-field"
              required
            />
          )}

          <button
            type="submit"
            className={`submit-btn ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : userType === "student"
              ? "Create Student"
              : "Create Faculty"}
          </button>
        </form>

        {/* Toggle Buttons */}
        <div className="flex flex-col mt-6 gap-2">
          <label className="text-white font-semibold">Create as:</label>
          <div className="flex justify-between bg-gray-700 rounded-full p-2">
            <span
              onClick={() => setUserType("student")}
              className={`toggle-option ${
                userType === "student" ? "active" : ""
              }`}
            >
              Student
            </span>
            <span
              onClick={() => setUserType("faculty")}
              className={`toggle-option ${
                userType === "faculty" ? "active" : ""
              }`}
            >
              Faculty
            </span>
          </div>
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

        .toggle-option {
          width: 48%;
          text-align: center;
          padding: 10px 0;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          background-color: transparent;
          color: white;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .toggle-option.active {
          background-color: #4f46e5;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default CreateUser;
