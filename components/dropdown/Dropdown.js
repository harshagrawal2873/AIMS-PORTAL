"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/utils/auth";

const Dropdown = ({ icon, menuItems }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Add mounted state
  const dropdownRef = useRef(null);
  const router = useRouter(); // For routing after logout

  useEffect(() => {
    setMounted(true); // Set mounted to true when component is mounted
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const onMenuItemClick = async (item) => {
    if (item.label === "Logout") {
      await handleLogout(); // Wait for logout to complete
      router.push("/login"); // Redirect to the login page
    }
  };

  if (!mounted) return null; // Don't render the component until mounted

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 hover:text-gray-300 transition duration-300 ease-in-out transform active:scale-95 hover:scale-125"
      >
        {icon}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`text-gray-300 transition-transform duration-300 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        >
          <path
            d="M6 9l6 6 6-6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="8"
          />
        </svg>
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-64 dark:bg-gray-700">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {menuItems.map((item, index) => (
              <li
                key={index}
                onClick={() => onMenuItemClick(item)} // Handle item click
                className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
              >
                {item.href ? (
                  <Link href={item.href}>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </h4>
                  </Link>
                ) : (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </h4>
                    <h6 className="text-gray-500 text-sm dark:text-gray-400">
                      {item.description}
                    </h6>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
