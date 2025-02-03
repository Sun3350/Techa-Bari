import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import './subscriber.css';
import { useDispatch } from "react-redux";
import { FaFacebook, FaInstagram, FaTimes } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SubscribeAndVerify = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
 
  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle subscription
  const handleSubscribe = async () => {
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
  
    // Capture the current page URL before sending the subscription request
    const currentLocation = window.location.href;
    localStorage.setItem("redirectAfterVerification", currentLocation); // Store it in localStorage
    localStorage.setItem('subscriber',  email);

    setLoading(true); // Start the loader
    try {
      const response = await axios.post("http://localhost:5000/api/userPost/subscribe", { email });
      setMessage(response.data.message);
      setIsSubscribed(true); // Set subscription state
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred. Try again.");
    } finally {
      setLoading(false); // Stop the loader
    }
  };
  

 

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-96 shadow-lg relative"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        <h2 className="text-xl font-semibold mb-4">Subscribe to Access</h2>

        {!isSubscribed ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            />
            <button
              onClick={handleSubscribe}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full  m-0"
              disabled={loading || !email}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
            <div className="divider ">
      <hr className="line" />
      <span className="text">Follow Us</span>
      <hr className="line" />
    </div>
    <div className="flex w-full justify-center items-center">
      <a className="mx-3 text-lg " href="/"><FaFacebook/></a>
      <a className="mx-3 text-lg " href="/"><FaInstagram/></a>
      <a className="mx-3 text-lg " href="/"><FaXTwitter/></a>
      <a href=""></a>
    </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            {loading && (
              <motion.div
                className="flex items-center justify-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="subscriberLoader border-t-blue-500 border-4 border-gray-300 rounded-full w-8 h-8 animate-spin"></div>
                <p className="ml-4">Verifying your email...</p>
              </motion.div>
            )}
            {!loading && (
              <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>{message}</p>
              </motion.div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="text-gray-500 mt-4 underline text-sm absolute top-1 right-1 rounded p-1 bg-slate-200 transition-transform hover:scale-105"
        >
          <FaTimes/>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SubscribeAndVerify;
