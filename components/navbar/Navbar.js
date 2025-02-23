"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import notificationLogo from "../../public/navbar-logos/notification-logo.svg";
import Dropdown from "../dropdown/Dropdown";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const currentPath = usePathname() || "/";
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isAdvisor, setIsAdvisor] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      fetchUserData(user.role, user.email);
      checkAdvisorStatus(user.id);
    }
  }, [user, loading]);

  const fetchUserData = async (role, email) => {
    try {
      const response = await fetch(`/api/profile/${role}/${email}`);
      if (!response.ok) throw new Error("Failed to fetch profile data");

      const data = await response.json();
      setUserData({
        name: data.name || "Unknown",
        photo: data.photo || "/default-profile.png",
      });
    } catch (err) {
      setError(err.message);
    }
  };
  
  const checkAdvisorStatus = async (facultyId) => {
    try {
      const response = await fetch(`/api/is-faculty-advisor/${facultyId}`);
      if (response.ok) {
        const { isAdvisor } = await response.json();
        setIsAdvisor(isAdvisor);
      }
    } catch (error) {
      console.error("Failed to check advisor status:", error);
    }
  };

  const tabs = [
    { label: "Home", path: "/home" },
    { label: "Student Record", path: "/student-record", roles: ["student"] },
    {
      label: "Current Semester",
      path: "/current-semester",
      roles: ["student"],
    },
    { label: "Courses", path: "/courses", roles: ["student"] },
    { label: "My Courses", path: "/faculty/my-courses", roles: ["professor"] },
    { label: "Student Applications", path: "/requests", roles: ["professor"], showIfAdvisor: true },
    {
      label: "Create Course",
      path: "/faculty/create-course",
      roles: ["professor"],
    },
    {
      label: "Student Applications",
      path: "/admin/student-applications",
      roles: ["admin"],
    },
    {
      label: "User Management",
      path: "/admin/user-management",
      roles: ["admin"],
    },
    {
      label: "Course Management",
      path: "/admin/course-management",
      roles: ["admin"],
    },
    {
      label: "Result Management",
      path: "/admin/result-management",
      roles: ["admin"],
    },
    { label: "About", path: "/about" },
    { label: "Help", path: "/help" },
  ];

  const notificationMenuItems = [
    { label: "News1", description: "CGPA updated" },
    { label: "News2", description: "New Semester started" },
    { label: "News3", description: "New Course floated" },
    { label: "News4", description: "Check your grades" },
  ];

  const profileMenuItems = [
    { label: "Profile", href: "/profile" },
    { label: "Logout" },
  ];

  useEffect(() => {
    if (!loading) {
      setMounted(true);
    }
  }, [loading]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const isActiveTab = (path) => currentPath === path;

  if (!mounted || loading) {
    return (
      <nav className="bg-gray-800 text-white flex justify-center items-center h-16">
        <p>Loading...</p>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 text-white px-4 sm:px-6 py-3 shadow-lg">
      <div className="flex justify-between items-center">
        <Link
          href="/home"
          className="text-xl font-bold hover:scale-105 transition duration-300"
        >
          AIMS-SGSITS
        </Link>

        <div className="sm:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        <div className="hidden sm:flex space-x-4">
          {tabs
            .filter(
              (tab) =>
                (!tab.roles || tab.roles.includes(user?.role)) &&
              (!tab.showIfAdvisor || isAdvisor)
          )
            .map((tab, index) => (
              <Link
                key={index}
                href={tab.path}
                className={`${
                  isActiveTab(tab.path)
                    ? "bg-gray-700 px-3 py-2 rounded-md font-bold"
                    : "hover:bg-gray-700 px-3 py-2 rounded-md"
                }`}
              >
                {tab.label}
              </Link>
            ))}
        </div>

        <div className="hidden sm:flex space-x-4 items-center">
          <Dropdown
            icon={
              <Image
                src={notificationLogo}
                alt="Notification"
                width={24}
                height={24}
              />
            }
            menuItems={notificationMenuItems}
            menuClassName="absolute right-0 mt-2 z-10 bg-white shadow-lg rounded-lg w-64"
          />
          <Dropdown
            icon={
              userData ? (
                <Image
                  src={userData.photo}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="rounded-full border"
                />
              ) : (
                <div className="w-9 h-9 bg-gray-500 rounded-full" />
              )
            }
            menuItems={profileMenuItems}
            menuClassName="absolute right-0 mt-2 z-10 bg-white shadow-lg rounded-lg w-64"
          />
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden mt-4 space-y-2">
          {tabs
            .filter((tab) => !tab.roles || tab.roles.includes(user?.role))
            .map((tab, index) => (
              <Link
                key={index}
                href={tab.path}
                className="block bg-gray-700 text-center px-3 py-2 rounded-md"
              >
                {tab.label}
              </Link>
            ))}
          <div className="relative flex justify-end items-center mt-2 space-x-4">
            <Dropdown
              icon={
                <Image
                  src={notificationLogo}
                  alt="Notification"
                  width={24}
                  height={24}
                />
              }
              menuItems={notificationMenuItems}
              menuClassName="absolute right-0 mt-2 z-10 bg-white shadow-lg rounded-lg w-64"
            />
            <Dropdown
              icon={
                userData ? (
                  <Image
                    src={userData.photo}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full border"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gray-500 rounded-full" />
                )
              }
              menuItems={profileMenuItems}
              menuClassName="absolute right-0 mt-2 z-10 bg-white shadow-lg rounded-lg w-64"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
