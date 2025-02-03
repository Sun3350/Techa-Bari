import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useNotification } from "../Staff/Notification/NotificationContext";
import { motion } from 'framer-motion';

const AdminHome = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeNotificationId, setActiveNotificationId] = useState(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const maxTitleLength = 50;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/api/notification/unread-notifications');
        setNotifications(response.data);
        if (response.data.length > 0) {
          showNotification('New Notifications', `${response.data.length} unread notifications`);
        }
      } catch (error) {
        showNotification('Error', 'Failed to fetch notifications. Please try again.');
      }
    };

    fetchNotifications();
  }, []);

  const toggleNotificationDetails = (notificationId) => {
    // Toggle the active notification
    setActiveNotificationId((prevId) => (prevId === notificationId ? null : notificationId));
  };

  const handleViewDetails = (blogId) => {
    navigate(`/staff/admin/single/${blogId}`);
  };

  return (
    <div className="p-5">
      <div>
       <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-[var(--text-color)]"
        >
          Admin Dashboard
        </motion.h1>
      </div>
      <div className="w-[35%] bg-[var(--container-background)] py-5 px-3 rounded-lg h-auto shadow-md">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        <div className="h-auto overflow-y-auto">
          <ul className="flex flex-col-reverse">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification._id}>
                  <li
                    className="p-3 w-[100%] rounded-lg mb-2 cursor-pointer flex justify-between items-start shadow-md bg-blue-600 text-[#ffffff] hover:bg-blue-700"
                    onClick={() => toggleNotificationDetails(notification._id)}
                    aria-label={`Notification: ${notification.message}`}
                  >
                    <p className="font-semibold text-sm text-left">{notification.message}</p>
                    {notification.createdAt && (
                      <p className="text-sm text-[#ffffff]">
                        {formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true })}
                      </p>
                    )}
                  </li>
                  {activeNotificationId === notification._id && (
                    <div onClick={() => handleViewDetails(notification.blogId)} className="p-4 bg-gray-100 shadow-inner rounded-b-lg animate-slide-in cursor-pointer">
                      <h3 className="text-sm font-semibold"><strong>Title: </strong>{notification.title.length > maxTitleLength ? notification.title.slice(0, maxTitleLength) + '...' : notification.title}</h3>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <li className="text-gray-500 text-center">No notifications found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
