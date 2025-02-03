import React from "react";
import { useNotification } from "./NotificationContext";
import { motion } from "framer-motion";

const Notification = () => {
  const { notification, hideNotification } = useNotification();

  if (!notification) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 p-4 rounded shadow-md text-white z-50 ${
        notification.type === "error"
          ? "bg-red-500"
          : notification.type === "success"
          ? "bg-green-500"
          : "bg-blue-500"
      }`}
      onClick={hideNotification} // Dismiss on click
    >
      <p className="text-white text-sm">{notification.message}</p>
    </motion.div>
  );
};

export default Notification;
