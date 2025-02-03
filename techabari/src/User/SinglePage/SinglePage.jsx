import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Pages/Subscriber/subscriber.css';
import { useSelector } from 'react-redux';
import SubscribeAndVerify from '../../Pages/Subscriber/Subscriber';

const PostDetails = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showSubscribeOverlay, setShowSubscribeOverlay] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/userPost/posts/${id}`);
        setPost(response.data);
        setLikes(response.data.likesCount); // Initialize likes count
        setComments(response.data.comments); // Initialize comments
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post details:', err);
        setError('Failed to fetch post details.');
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);
  const subscribeUser = useSelector((state) => state.auth.subscribeUser);
  const handleLike = async () => {
    // Check if the user is subscribed
    if (!subscribeUser) {
      setShowSubscribeOverlay(true);
      return;
    }
  
    const email = localStorage.getItem('subscriber');
    
    if (!email) {
      console.error('Subscriber email not found in localStorage');
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:5000/api/userPost/posts/${id}/like`, {
        email, // Send the email to backend for tracking
      });
  
      setLikes(response.data.likesCount); // Update the likes count (not the email addresses)
    } catch (err) {
      console.error('Error liking the post:', err);
    }
  };
  
  

  const handleAddComment = async () => {
    if (!subscribeUser) {
      setShowSubscribeOverlay(true);
      return;
    }

    if (!commentText.trim()) {
      alert('Comment cannot be empty!');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/userPost/posts/${id}/comment`, {
        text: commentText,
        user: 'Anonymous', // Static user value for anonymous comments
      });

      setComments(response.data.comments); // Update comments
      setCommentText(''); // Clear the input field
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <div className="shadow-lg rounded-lg p-6 bg-white">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-700 mb-4">By {post.author}</p>
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Actions Section */}
        <div className="flex items-center justify-around mt-4">
          {/* Like Button */}
          <div className="text-center">
            <button
              className="flex items-center justify-center text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              onClick={handleLike}
            >
              ❤️ Like
            </button>
            <p className="text-sm mt-1">{likes} </p>
            
          </div>

          {/* Share Button */}
          <div className="text-center">
            <button
              className="flex items-center justify-center text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/post/${id}`)}
            >
              🔗 Share
            </button>
            <p className="text-sm mt-1">Share this post</p>
          </div>
        </div>

        {/* Comment Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Leave a Comment:</h3>
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Write your comment..."
              className="flex-grow border border-gray-300 rounded px-4 py-2"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleAddComment}
            >
              Post
            </button>
          </div>

          {/* Comment List */}
          {comments.length > 0 && (
            <ul className="list-disc pl-5 space-y-2">
              {comments.map((comment, index) => (
                <li key={index} className="text-gray-700">
                  {comment.user}: {comment.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Subscribe Overlay */}
      {showSubscribeOverlay && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
    <SubscribeAndVerify onClose={() => setShowSubscribeOverlay(false)} />
  </div>
)}

    </div>
  );
};

export default PostDetails;
