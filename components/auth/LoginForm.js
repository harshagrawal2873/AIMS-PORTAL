"use client";
import React, { useState } from "react";
import { toast } from 'react-toastify';

const LoginForm = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!email.endsWith("@iitrpr.ac.in")) {
    //   setError("Please use a valid email address.");
    //   toast.error("Please use a valid email address.");
    //   return;
    // }
    setLoading(true);

    try {
      const response = await fetch("/api/auth/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setError("");
        onNext(email);
        toast.success(data.message);
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      setError("Failed to send OTP. Please try again later.");
      toast.error("Failed to send OTP. Please try again later.");
    }finally{
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-2xl w-full max-w-md mx-auto text-center"
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">LOGIN</h1>
      <div className="mb-4 text-left">
        <label
          htmlFor="email"
          className="block mb-2 text-sm sm:text-base font-medium text-gray-300"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
          disabled={loading}
        />
      </div>
      {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
      <button
        type="submit"
        className={`bg-gray-700 hover:bg-gray-900 text-white py-2 px-4 rounded-md w-full transition${
          loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled ={loading}
      >
        {loading ? "Sending OTP ..." : "Send OTP"}
      </button>
    </form>
  );
};

export default LoginForm;