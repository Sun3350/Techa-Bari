import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns'; // Import the function
import axiosInstance from '../../utils/axiosConfig';
import { TextLoader } from '../../utils/Loader';


function ApprovedBlog() {
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [hoveredPostId, setHoveredPostId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/blogger/published-blogs`);
        setPublishedBlogs(response.data);
      } catch (error) {
        console.error('Error fetching published blogs:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDeleteConfirmation = (postId) => {
    setDeleteConfirmation(postId);
  };

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/api/blogger/admin-delete/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPublishedBlogs((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const maxTitleLength = 45;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="p-6 bg-[var(--background-color)] min-h-screen"
    >
      <div className="text-start mb-8">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-[var(--text-color)]"
        >
          Approved Posts
        </motion.h1>
      </div>

      {loading && <TextLoader
          messages={['Loading your blogs...', 'Fetching data...']}
          direction="vertical"
        />}
      {!loading && publishedBlogs.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-500"
        >
          No published blogs available.
        </motion.p>
      )}
      {!loading && publishedBlogs.length > 0 && (
        <motion.div
          className="grid gap-2 md:grid-cols-2 lg:grid-cols-5"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          {publishedBlogs.map((post) => (
            <div
              key={post._id}
              className="relative bg-[var(--background-color)] shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => setHoveredPostId(post._id)}
              onMouseLeave={() => setHoveredPostId(null)}
            >
              {deleteConfirmation === post._id && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center rounded-lg z-10">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white text-lg mb-4"
                  >
                    Are you sure you want to delete this post?
                  </motion.p>
                  <div className="space-x-4">
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 m-0"
                      onClick={() => handleDelete(post._id)}
                    >
                      Yes
                    </button>
                    <button
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                      onClick={() => setDeleteConfirmation(null)}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              {hoveredPostId === post._id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-2 right-2 flex justify-center items-center space-x-2 z-10"
                >
                  <button
                    className=" text-red-500 p-0 m-0"
                    onClick={() => handleDeleteConfirmation(post._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <Link
                    to={`/staff/admin/edit/${post._id}`}
                    className=" text-blue-500 "
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                </motion.div>
              )}

              <Link to={`/staff/admin/single/${post._id}`} className="block">
                <h2 className="text-sm text-blue-600 font-medium mb-2">{post.category}</h2>
                <div
                  className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  )}
                </div>
                <h1 className="text-lg font-bold text-[var(--text-color)">
                  {post.title.length > maxTitleLength
                    ? `${post.title.slice(0, maxTitleLength)}...`
                    : post.title}
                </h1>
                <p className="text-sm text-gray-500 mt-2">{post.author}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                </p>
              </Link>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default ApprovedBlog;
