import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info", duration = 3000) => {
    setNotification({ message, type });

    // Auto-hide notification after duration
    if (duration > 0) {
      setTimeout(() => setNotification(null), duration);
    }
  };

  const hideNotification = () => setNotification(null);

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
