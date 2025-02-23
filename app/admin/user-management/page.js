"use client";
import Link from "next/link";

export default function UserManagement() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 sm:p-10 max-w-lg w-full text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
          User Management
        </h1>
        <p className="text-gray-400 mb-8 text-lg">
          Effortlessly manage users and batches.
        </p>
        <div className="space-y-4">
          {" "}
          <Link href="/admin/user-management/create-user">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 my-3 rounded-lg transition-all duration-300 ease-in-out shadow-md">
              Create User
            </button>
          </Link>
          <Link href="/admin/user-management/view-users">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 my-3 rounded-lg transition-all duration-300 ease-in-out shadow-md">
              View Users
            </button>
          </Link>
          <Link href="/admin/user-management/create-batch">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 my-3 rounded-lg transition-all duration-300 ease-in-out shadow-md">
              Create Batch
            </button>
          </Link>
          <Link href="/admin/user-management/view-batches">
            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 my-3 rounded-lg transition-all duration-300 ease-in-out shadow-md">
              View Batch
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
