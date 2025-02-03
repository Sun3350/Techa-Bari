import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Use react-router-dom's Link
import './adminBlogs.css'
import { TextLoader } from '../../utils/Loader';
const UnpublishedBlogPosts = () => {
  const maxTitleLength = 50;

  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [badgeCount, setBadgeCount] = useState(0);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [hoveredPostId, setHoveredPostId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/blogger/unpublished-blogs`);
        setPublishedBlogs(response.data);

        const newBadgeCount = response.data.length;
        setBadgeCount(newBadgeCount);

        // Update localStorage with the new badge count
        localStorage.setItem('unpublishedBadgeCount', newBadgeCount.toString());
      } catch (error) {
        console.error('Error fetching unpublished blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
 // const pendingBlogs = blogPosts.filter((blog) => blog.status === 'pending');

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/api/blogger/admin-delete/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update state to remove the deleted post
      setPublishedBlogs((prevPosts) => prevPosts.filter((post) => post._id !== postId));

      const newBadgeCount = badgeCount - 1;
      localStorage.setItem('unpublishedBadgeCount', newBadgeCount.toString());
      setBadgeCount(newBadgeCount);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between list items
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 }, // Start off-screen
    visible: { opacity: 1, x: 0 }, // Slide into place
  };

  return (
    <div className="admin-approve-container p-4 bg-[var(--background-color)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pending Posts</h1>
        {badgeCount > 0 && (
          <div className="badge bg-red-500 text-white px-3 py-1 rounded-full">
            <span>{badgeCount}</span>
          </div>
        )}
      </div>

      {loading && <TextLoader
          messages={['Loading your blogs...', 'Fetching data...']}
          direction="vertical"
        />}
      {!loading && publishedBlogs.length === 0 && <p className="text-gray-500">No unpublished blogs available.</p>}
      {!loading && publishedBlogs.length > 0 && (
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 style={{ direction: 'rtl' }}"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {publishedBlogs.map((post) => (
            <motion.div
              key={post._id}
              className="relative p-4  shadow-md rounded-lg border hover:shadow-lg transition"
              variants={itemVariants}
              onMouseEnter={() => setHoveredPostId(post._id)}
              onMouseLeave={() => setHoveredPostId(null)}
            >
              {deleteConfirmation === post._id && (
                <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex flex-col justify-center items-center text-white p-4 rounded-lg">
                  <p className="mb-4">Are you sure you want to delete this post?</p>
                  <div className="flex space-x-4">
                    <button
                      className="px-4 py-2 bg-red-500 rounded-lg"
                      onClick={() => handleDelete(post._id)}
                    >
                      Yes
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-500 rounded-lg"
                      onClick={() => setDeleteConfirmation(null)}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
              {hoveredPostId === post._id && (
                <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full ">
                  <button className='delete-button' onClick={() => setDeleteConfirmation(post._id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
              <Link to={`/staff/admin/single/${post._id}`} className="block">
                <h2 className="text-xl font-bold"> {post.title.length > maxTitleLength
                      ? post.title.slice(0, maxTitleLength) + '...'
                      : post.title}</h2>
                <p className="text-gray-600">{post.author}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default UnpublishedBlogPosts;
