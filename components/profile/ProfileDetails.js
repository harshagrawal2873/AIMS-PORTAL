import React from "react";

const ProfileDetails = ({ details }) => {
  return (
    <section className="w-full max-w-2xl bg-gray-800 rounded-2xl py-12 px-8 shadow-lg my-6 transform transition duration-500 hover:scale-105">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        Profile Details
      </h2>
      <ul className="text-gray-300 space-y-4">
        {details.map((detail, index) => (
          <li
            key={index}
            className="flex justify-between py-2 border-b border-gray-700"
          >
            <span className="font-semibold">{detail.label}:</span>
            <span>{detail.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProfileDetails;
