"use client";
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';

const Header = () => {
  const [text, setText] = useState("");
  const fullText = "Welcome to AIMS Portal";
  const typingSpeed = 100;

  useEffect(() => {
    let currentIndex = 0;
    const type = () => {
      if (currentIndex < fullText.length) {
        setText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(type, typingSpeed);
      }
    };

    type();
  }, []);

  return (
    <header className="text-center py-6 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100">
      <span>{text}</span>
    </header>
  );
};

export default Header;
