"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/auth/Header";
import LoginForm from "@/components/auth/LoginForm";
import OTPForm from "@/components/auth/OTPForm";
import LogoutMessage from "@/components/auth/LogoutMessage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [logoutMessage, setLogoutMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const {user} = useAuth();

  useEffect(() => {
    const message = searchParams.get("message");
    console.log("Query message:", message);

    if (message === "logout-success") {
      toast.success("You have been logged out successfully.");
      router.replace("/login"); // Clean up URL
    }
  }, [searchParams, router]);

  const handleNext = (enteredEmail) => {
    setEmail(enteredEmail);
    setStep(2);
  };

  const handleVerify = async () => {
    console.log("User verified, redirecting to Home...");
    setStep(3); // Update the step to indicate OTP is verified
  
    // Use a promise to ensure `refresh` completes before navigating
    await router.refresh();
  
    // await new Promise((resolve) => setTimeout(resolve, 100));
  
    // Navigate to the home page
    router.push("/home");
    router.push("/home");
    console.log("Successfully redirected to the home page >> XD with the USER :: ", user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 bg-gray-900 text-white">
      <ToastContainer />
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-gray-800 py-8 px-6 rounded-2xl shadow-lg text-center">
        <Header />
        {logoutMessage && <LogoutMessage message={logoutMessage} />}
        {step === 1 && <LoginForm onNext={handleNext} />}
        {step === 2 && <OTPForm onVerify={handleVerify} email={email} />}
        {step === 3 && <p>Redirecting to home...</p>}
      </div>
    </div>
  );
};

export default LoginPage;
