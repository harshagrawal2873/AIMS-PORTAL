"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleLogout } from "@/utils/auth";

const LogoutButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogoutClick = async () => {
    setLoading(true);
    try {
      await handleLogout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogoutClick}
      disabled={loading}
      className={`bg-red-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md hover:bg-red-500 transition ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Logging Out..." : "Log Out"}
    </button>
  );
};

export default LogoutButton;
