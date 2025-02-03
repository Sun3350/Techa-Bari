import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import axiosInstance from '../../utils/axiosConfig';
import '../staff.css';
import { TextLoader } from '../../utils/Loader'; // Update the path accordingly
import { MdOutlineMessage } from "react-icons/md";
import { motion } from 'framer-motion';  // Import framer-motion
import { useNotification } from "../Notification/NotificationContext";

function UserBlogPosts() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [hoveredPostId, setHoveredPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatNotificationCount, setChatNotificationCount] = useState(0); // State for notifications
  const [currentTime, setCurrentTime] = useState(new Date());
  const { showNotification } = useNotification();

  const decodeToken = (token) => {
    if (!token) return null;
    const payload = token.split(".")[1]; // Extract payload part
    return JSON.parse(atob(payload)); // Decode from Base64
  };

  useEffect(() => {
    const fetchUserBlogPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = decodeToken(token); // Use custom decode function
  
        if (decodedToken) {
          const userId = decodedToken.userId; // Ensure `userId` exists in the token payload
          setUsername(decodedToken.username); // Optionally set username if needed
  
          const response = await axiosInstance.get(`/api/blogger/posts-by-user`);
          setBlogPosts(response.data); // Set the blog posts data
  
          console.log(response.data); // Debugging log to check the response data
        }
      } catch (error) {
       showNotification("Error fetching user blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
  
   

    const fetchChatNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/api/notification/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Assuming `count` field in the response for unread notifications
        setChatNotificationCount(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching chat notifications:", error);
      }
    };

    fetchUserBlogPosts();
    fetchChatNotifications();
  }, []);

  const handleDeleteConfirmation = (postId) => {
    setDeleteConfirmation(postId);
  };

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/api/blogger/delete/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      showNotification('Error deleting post:', error);
    }
  };

  const maxTitleLength = 50;

  const handleMouseEnter = (postId) => {
    setHoveredPostId(postId);
  };

  const handleMouseLeave = () => {
    setHoveredPostId(null);
  };

  const handleTouchStart = (postId) => {
    setHoveredPostId(postId);
  };

  const handleTouchEnd = () => {
    setHoveredPostId(null);
  };


  // Function to update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // Function to get the greeting based on the current hour
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };
  const formatTime = (time) => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const statusComponents = {
    approved: (publishedAt) => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-1">
          <p className="text-blue-600 font-medium">Approved:</p>
          {publishedAt && (
            <p>
              {formatDistanceToNow(parseISO(publishedAt), { addSuffix: true })}
            </p>
          )}
        </div>
      </motion.div>
    ),
    rejected: () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-red-600 font-medium">Rejected</p>
      </motion.div>
    ),
    pending: () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-yellow-600 font-medium">Pending...</p>
      </motion.div>
    ),
  };

  const renderStatus = (status, publishedAt) => {
    if (!status) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-600 font-medium">Unknown Status</p>
        </motion.div>
      );
    }

    const trimmedStatus = status.trim().toLowerCase();
    return statusComponents[trimmedStatus]?.(publishedAt) ?? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-gray-600 font-medium">Unknown Status</p>
      </motion.div>
    );
  };

  const pendingBlogs = blogPosts.filter((blog) => blog.status === 'pending');
  const rejectedBlogs = blogPosts.filter((blog) => blog.status === 'rejected');
  const approvedBlogs = blogPosts.filter((blog) => blog.status === 'approved');

  return (
    <div className="px-6 min-h-screen bg-[var(--background-color)]">
    <motion.div
      className="bg-[var(--container-background)] p-6 rounded flex justify-between sticky top-0 z-10 mt-6 shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-bold">
          {getGreeting()}, {username || "User"}!
        </h1>
      </div>
      <div className="relative flex">
        <h2 className="text-2xl font-bold mx-4">{formatTime(currentTime)}</h2>
        <MdOutlineMessage className="text-xl font-bold text-[var(--text-color)]" />
        {chatNotificationCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1"
            title={`${chatNotificationCount} new messages`}
          >
            {chatNotificationCount}
          </span>
        )}
      </div>
    </motion.div>

    <motion.div
      className="w-full flex flex-col justify-center items-center py-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      {/* Pending Blogs */}
      <motion.div
        className="w-full rounded flex justify-between h-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="rounded bg-[var(--container-background)] w-[49%] p-5 h-fit overflow-y-auto shadow-md">
          <h1 className="px-2 py-[2px] font-semibold text-sm rounded text-[var(--button-text-color)] bg-green-600 w-fit mb-5">Pendings...</h1>
          <div className='flex flex-col-reverse'>
            {pendingBlogs.length > 0 ? (
            pendingBlogs.map((blog, index) => (
              <motion.a
                key={blog.id}
                href={`/staff/single/${blog._id}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
               
              >
                <div className="mt-3 p-3 border rounded flex  items-center">
                  <img className="w-20 rounded mr-3 transition-transform hover:scale-105" src={blog.image} alt="" />
                  <h2 className="font-normal">{blog.title}</h2>
                </div>
              </motion.a>
            ))
          ) : (
            <p className="text-gray-500">You don't have any Pending Post.</p>
          )}
          </div>
          
        </div>

        {/* Rejected Blogs */}
        <div className="rounded bg-[var(--container-background)] w-[49%] h-fit p-5 shadow-md">
          <h1 className="px-2 py-[2px] font-semibold text-sm rounded text-[var(--button-text-color)] bg-red-600 w-fit mb-5">Rejected</h1>
          <div className='flex flex-col-reverse'>
            {rejectedBlogs.length > 0 ? (
            rejectedBlogs.map((blog, index) => (
              <motion.a
                key={blog.id}
                href={`/staff/single/${blog._id}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="mt-3 p-3 border rounded flex  items-center">
                  <img className="w-20 rounded mr-3 transition-transform hover:scale-105" src={blog.image} alt="" />
                  <h2 className="font-normal">{blog.title}</h2>
                </div>
              </motion.a>
            ))
          ) : (
            <p className="text-gray-500">You don't have any Rejected Post.</p>
          )}
          </div>
          
        </div>
      </motion.div>

      {/* Approved Blogs */}
      <motion.div
        className="w-full mt-8 rounded bg-[var(--container-background)] p-5 shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <h1 className="px-2 py-[2px] font-semibold text-sm rounded text-[var(--button-text-color)] bg-blue-600 w-fit mb-5">Approved</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5'>
             {approvedBlogs.length > 0 ? (
          approvedBlogs.map((blog, index) => (
            <motion.a
              key={blog.id}
              href={`/staff/single/${blog._id}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="mt-3 p-3 border rounded flex items-center">
                <img className="w-20 rounded mr-3 transition-transform hover:scale-105" src={blog.image} alt="" />
                <h2 className="font-normal">{blog.title}</h2>
              </div>
            </motion.a>
          ))
        ) : (
          <p className="text-gray-500">You don't have any Approved Post.</p>
        )}
        </div>
     
      </motion.div>
    </motion.div>
      <div className="mb-6 text-center">
            <p className="text-3xl font-bold text-[var(--text-color)]  my-10">All Your Posts</p>
          </div>
      {loading ? (
        <TextLoader
          messages={['Loading your blogs...', 'Fetching data...']}
          direction="vertical"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mt-10 ">
            {blogPosts.map((post) => (
              <div
                key={post._id}
                className={`relative p-4 bg-[var(--container-background)] rounded-lg shadow-lg transition-all`}
                onMouseEnter={() => handleMouseEnter(post._id)}
                onMouseLeave={handleMouseLeave}
                onTouchStart={() => handleTouchStart(post._id)}
                onTouchEnd={handleTouchEnd}
              >
                {deleteConfirmation === post._id && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center rounded-lg">
                    <p className="text-white mb-4">Are you sure you want to delete this post?</p>
                    <div className="space-x-4">
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => handleDelete(post._id)}
                      >
                        Yes
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        onClick={() => setDeleteConfirmation(null)}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
                {hoveredPostId === post._id && (
                  <div className="absolute top-2 right-2 flex justify-center items-center space-x-2">
                    <button
                      className="text-red-500 p-0 m-0"
                      onClick={() => setDeleteConfirmation(post._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <a href={`/staff/create/${post._id}`} className="text-blue-500 m-0">
                      <FontAwesomeIcon icon={faEdit} />
                    </a>
                  </div>
                )}
                <h2 className="text-xs font-extrabold text-blue-600 uppercase">{post.category}</h2>
                <a href={`/staff/single/${post._id}`}>
                  <div className="w-full h-28 overflow-hidden rounded-md my-4">
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    )}
                  </div>
                  <h1 className="text-sm font-bold mb-2">
                    {post.title.length > maxTitleLength
                      ? post.title.slice(0, maxTitleLength) + '...'
                      : post.title}
                  </h1>
                  <div className="text-sm text-gray-600 flex items-center space-x-2">
                  {renderStatus(post.status, post.publishedAt)}
                  </div>
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default UserBlogPosts;
