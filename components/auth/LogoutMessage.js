"use client";
import React from "react";

const LogoutMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#d4edda",
        color: "#155724",
        border: "1px solid #c3e6cb",
        borderRadius: "5px",
        fontSize: "1rem",
        fontWeight: "400",
        textAlign: "center",
        maxWidth: "300px",
        margin: "20px auto",
        lineHeight: "1",
      }}
    >
      {message}
    </div>
  );
};

export default LogoutMessage;
