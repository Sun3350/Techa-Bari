import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../Pages/Subscriber/subscriber.css";
import { useSelector } from "react-redux";
import SubscribeAndVerify from "../../Pages/Subscriber/Subscriber";
import { motion } from "framer-motion";
import { FaComments, FaFacebook, FaInstagram, FaShare, FaShareAlt, FaShareAltSquare, FaTwitter } from "react-icons/fa";
import { formatDistanceToNow, parseISO } from 'date-fns';
import './singlePage.css'
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { GrView } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { IoReturnUpBackOutline } from "react-icons/io5";


const PostDetails = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showSubscribeOverlay, setShowSubscribeOverlay] = useState(false);
  const [showSocial, setShowSocial] = useState(true)
  const [isLiked, setIsLiked] = useState(false);
  const scrollTimeout = useRef(null); // ✅ Track scrolling timeout
  const [totalComments, setTotalComments] = useState(0)

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/userPost/posts/${id}`);
        setPost(response.data);
        setLikes(response.data.likesCount);
  
        const email = localStorage.getItem("subscriber"); // ✅ Get user email from local storage
        if (email && response.data.likes?.includes(email)) { // ✅ Ensure `likes` is not undefined
          setIsLiked(true); // ✅ Set isLiked correctly on refresh
        } else {
          setIsLiked(false); // Ensure it's false if the user hasn't liked it
        }
  
        setLoading(false);
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError("Failed to fetch post details.");
        setLoading(false);
      }
    };
  
    fetchPostDetails();
  }, [id]);
  
  useEffect(() => {
    fetchComments();
  }, [id]); // Fetch comments when `id` changes
  
  
  const subscribeUser = useSelector((state) => state.auth.subscribeUser);

  const handleLike = async () => {
    if (!subscribeUser) {
      setShowSubscribeOverlay(true);
      return;
    }
  
    const email = localStorage.getItem("subscriber");
    if (!email) {
      console.error("Subscriber email not found in localStorage");
      return;
    } 
  
    try {
      const response = await axios.post(`http://localhost:5000/api/userPost/posts/${id}/like`, {
        email,
      });
  
      console.log("Like response:", response.data);
      setLikes(response.data.likesCount); // ✅ Update likes count immediately
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Error liking the post:", err);
    }
  };
  

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/userPost/posts/${id}/comments`);
      setComments(response.data.comments || []);
      setTotalComments(response.data.totalComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };
  
  const handleAddComment = async () => {
    if (!subscribeUser) {
      setShowSubscribeOverlay(true);
      return;
    }
  
    if (!commentText.trim()) {
      alert("Comment cannot be empty!");
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api/userPost/posts/${id}/comment`,
        { text: commentText, user: "Anonymous" }
      );
  
      setComments(response.data.comments || []);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment.");
    }
  };
  
  


  useEffect(() => {
    const handleScroll = () => {
      // Hide the social actions while scrolling
      setShowSocial(false);

      // Detect when scrolling stops
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        setShowSocial(true); // Show again when scrolling stops
      }, 700); // Delay of 0.7s after scrolling stops
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, []);

  
  const [isSticky, setIsSticky] = useState(true);
  const blogRef = useRef(null);
  const commentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (blogRef.current && commentRef.current) {
        const blogBottom = blogRef.current.getBoundingClientRect().bottom;
        const commentHeight = commentRef.current.offsetHeight;
        setIsSticky(blogBottom > window.innerHeight + commentHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className=" w-full ">
    <div className=" flex justify-between w-full p-2">
      <div className="sticky top-24 w-32 flex flex-col justify-center items-center h-[80vh] ">
      
        <div 
           className={`fixed  left-0 h-full flex justify-center items-center flex-col w-32 top-1/2  transform -translate-y-1/2 transition-all duration-500  ${
            showSocial ? "translate-x-0" : "-translate-x-full"
          }`}     
          >
            <div>
      <div className="text-center w-full relative flex flex-col justify-start items-center my-4">
          <motion.button
        whileTap={{ scale: 0.8 }} // Click Animation
        whileHover={{ scale: 1.1 }} // Hover Effect
        className="flex items-center justify-center w-12 h-8 rounded-full m-0 p-0"
        onClick={handleLike}
      >
        <motion.span
          initial={{ scale: 0.8, color: "#bbb" }} // Initial gray state
          animate={{
            scale: isLiked ? [1.2, 1] : [1, 1.2], // Small pop effect
            color: isLiked ? "#ff0000" : "#bbb", // Change color to red if liked
          }}
          transition={{ duration: 0.3 }}
          className="text-lg"
        >
          {isLiked ? "❤️" : "🤍"} {/* Switch between filled and outlined heart */}
        </motion.span>
      </motion.button>

      {/* Like Count */}
      <p className="text-xs ">{likes}</p> 
      </div>
       <div className="w-full flex flex-col items-center my-4">
          <GrView />
          <p className="text-xs">{post.views}</p>
          </div>
       <div className="w-full flex flex-col items-center my-4">
       <FaComments />

          <p className="text-xs">{totalComments}</p>
          </div>
         
      <div className="w-full flex items-center justify-center my-4">
            <button
              className="text-black m-0 p-0 rounded text-lg"
              onClick={() =>
                navigator.clipboard.writeText(
                  `${window.location.origin}/post/${id}`
                )
              }
            >
              <FaShareAlt/>
            </button>
          </div>
         
          <div className="w-full flex items-center flex-col text-lg">
            <a href="/"><FaFacebook className="m-3"/></a>
            <a href="/"><FaXTwitter  className="m-3"/></a>
            <a href="/"><FaInstagram className="m-3"/></a>
            <a href="/"><FaLinkedin className="m-3"/></a>
          </div>
      </div>
      <div>
     <button
        className="m-0 bg-slate-950 absolute bottom-5 right-8 align-bottom flex text-white px-4 py-2 rounded hover:bg-slate-900"
        onClick={() => navigate(-1)}
      >
        <IoReturnUpBackOutline />
</button>
     </div>
    </div>
      </div>
      <div className="flex w-[100%]">
      <div className=" p-6 w-[75%] flex flex-col items-center "  ref={blogRef}>
        <div className="w-[80%] "> <p className="text-blue-600  mb-1">
          <Link className="text-blue-600 uppercase font-extrabold" to={`/categories/${post.category.toLowerCase().replace(/\s+/g, '-')}`}>
                                 {post.category}
                               </Link>
        </p>
 
         <h1 className="text-2xl font-bold mb-2">{post.title}</h1></div>
               
         <div className="flex w-[80%]  justify-between">
                  <p className="text-gray-700 font-[600] ">Author: {post.author}</p>
               {post.publishedAt ? (
                  <p className="font-[600]">{formatDistanceToNow(parseISO(post.publishedAt), { addSuffix: true })}</p>
                ) : (
                  <p>Just now</p>
                )}

          </div>
         <div className="my-5 w-full flex flex-col items-center ">
           <img
                   src={post.image}
                   alt={post.title}
                   className="w-[80%] h-[50vh] object-cover rounded-md mb-1"
                 />
               <p className="text-black text-[10px] font-bold capitalize underline text-center">{post.imageDesc}</p>
              </div>
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> 
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> 
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> 
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> 
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> 
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> 
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> 
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> 
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> 
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> 
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> 
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> 
        <div
          className="text-gray-800 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> 
      </div>
      <div className="sticky top-28 right-10 w-[23%] h-[80vh] rounded-lg shadow-inner bg-[var(--container-background)] p-3"
       >

          <h3 className="text-lg font-semibold mt-2 ">Comment</h3>
     <hr/>
          <div className="w-full h-[75%] mt-2 flex flex-col items-center overflow-y-auto">
            
                {comments.length > 0 ? (
                <ul className="shadow-none w-full  space-y-2">
                  {comments.map((comment, index) => (
                    <div key={index} className="text-gray-700 text-sm text-left">
                      <h2 className="font-bold ">{comment.user}:</h2> {comment.text}

                      {index !== comments.length - 1 && <hr style={{ margin: "10px 0", border: "0.5px solid #ccc" }} />}

                    </div>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic text-center font-bold">No comments yet. Be the first to comment!</p>
              )} 

                        </div>
          <form onSubmit={handleAddComment} className="flex items-center mb-4 w-full">
            <textarea
              placeholder="Write your comment..."
              className="single-textarea  border border-gray-300 p-2  "
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              className=" bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black"
             type="submit"
            >
              <IoIosSend />

            </button>
         

      
        </form>
  </div>
    </div>
  
      {/* Subscribe Overlay */}
      {showSubscribeOverlay && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <SubscribeAndVerify onClose={() => setShowSubscribeOverlay(false)} />
        </div>
      )}
      </div>
    <div className="w-full h-[70vh] bg-amber-500 ">

    </div>
    </div>
  );
};

export default PostDetails;
