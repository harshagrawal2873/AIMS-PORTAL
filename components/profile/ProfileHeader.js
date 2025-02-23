import React from "react";

const ProfileHeader = ({ name, role, photo }) => {
  return (
    <section className="w-full max-w-2xl bg-gray-800 text-center py-6 px-8 rounded-2xl shadow-lg my-6 transform transition duration-500 hover:scale-105">
      <img
        src={photo}
        alt="Profile Photo"
        className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-700"
      />
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{name}</h1>
      <p className="text-lg text-gray-300">{role}</p>
    </section>
  );
};

export default ProfileHeader;
