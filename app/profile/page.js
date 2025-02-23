"use client";

import React, { useEffect, useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileDetails from "@/components/profile/ProfileDetails";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      fetchUserData(user.role, user.email);
    }
  }, [user, loading]);

  const fetchUserData = async (role, email) => {
    try {
      const response = await fetch(`/api/profile/${role}/${email}`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();
      setUserData({
        name: data.name || "Unknown",
        role: data.role || role,
        photo: data.photo || "/default-profile.png",
        details: [
          { label: "Email", value: data.email || "N/A" },
          ...(role === "student"
            ? [
                { label: "Roll Number", value: data.rollNumber || "N/A" },
                { label: "Department", value: data.department || "N/A" },
                { label: "Batch", value: data.batch || "N/A" },
              ]
            : role === "professor"
            ? [
                { label: "Department", value: data.department || "N/A" },
                { label: "Courses Taught", value: data.coursesTaught || "N/A" },
              ]
            : role === "admin"
            ? [{ label: "Role", value: "Administrator" }]
            : []),
        ],
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-6 px-4">
      {userData ? (
        <>
          <ProfileHeader
            name={userData.name}
            role={userData.role}
            photo={userData.photo}
          />
          <ProfileDetails details={userData.details} />
        </>
      ) : (
        <div className="text-center text-gray-400">No user data available</div>
      )}
    </div>
  );
};

export default ProfilePage;
