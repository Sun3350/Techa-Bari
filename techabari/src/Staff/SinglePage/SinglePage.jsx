import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { TextLoader } from '../../utils/Loader';

const SinglePostPage = () => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // Extract post ID from URL
        const pathnameArray = window.location.pathname.split('/');
        const postId = pathnameArray[pathnameArray.length - 1];

        // Fetch post details
        const response = await axiosInstance.get(`/api/blogger/postDetails/${postId}`);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post details:', err);
        setError('Error fetching post details');
      }
    };

    fetchPostDetails();
  }, []);

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen ">
<TextLoader
          messages={['Loading your blogs...', 'Fetching data...']}
          direction="vertical"
        />      </div>
    );
  }

  const goBack = () => {
    window.history.back();
  };

  const handleEdit = () => {
    // Navigate to edit page (replace `/edit` with the actual edit URL)
    navigate(`/staff/create/${post._id}`);
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)] p-6">
      <div className="max-w-4xl mx-auto bg-[var(--container-background)] text-white rounded-lg shadow-md overflow-hidden">
        {post.image && (
          <div className="h-64 w-full overflow-hidden">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-[var(--text-color)] mb-4">{post.title}</h1>
          <div className="flex justify-between items-center mb-4 text-sm text-[var(--text-color)]">
            <h2 className="text-blue-600 font-bold uppercase ">{post.category}</h2>
            <div className='flex'>
              <h3 className="italic mx-5">By: {post.author}</h3>
            <h3 className='font-semibold capitalize'>{post.status}...</h3>
            </div>
            
          </div>
          <div
            className="text-[var(--text-color)] text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {/* Show Edit button if post is not published */}
          {!post.isPublished && (
            <button
              onClick={handleEdit}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Post
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      )}

      <button
        onClick={goBack}
        className="mt-6 flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Go Back</span>
      </button>
    </div>
  );
};

export default SinglePostPage;
