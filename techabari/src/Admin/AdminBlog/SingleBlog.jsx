import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../utils/axiosConfig";

function SingleBlog() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [blogDetails, setBlogDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false); // Track the approving state
  const [rejecting, setRejecting] = useState(false); // Track the rejecting state

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/blogger/postDetails/${postId}`);
        setBlogDetails(response.data);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [postId]);

  const Notification = async () => {
    try {
      const response = await axiosInstance.put(`/api/notification/read-notifications/${postId}`);
      if (response.status === 200) {
        console.log("Notification read");
      } else {
        console.log("Failed to read notification");
      }
    } catch (error) {
      console.error("Error reading notification:", error);
    }
  };

  const handleApprove = async () => {
    try {
      setApproving(true); // Set approving state to true
      const response = await axiosInstance.put(`/api/blogger/update-status/${postId}`, { status: 'approved' });
      if (response.status === 200) {
        await Notification();
        setApproving(false); // Set approving state back to false
        navigate("/staff/admin/approved");
        console.log("Blog approved successfully");
      } else {
        setApproving(false); // Set approving state back to false
        console.error("Failed to approve blog");
      }
    } catch (error) {
      setApproving(false); // Set approving state back to false
      console.error("Error:", error);
    }
  };

  const handleReject = async () => {
    try {
      setRejecting(true); // Set rejecting state to true
      const response = await axiosInstance.put(`/api/blogger/update-status/${postId}`, { status: 'rejected' });
      if (response.status === 200) {
        await Notification();
        setRejecting(false); // Set rejecting state back to false
        navigate("/staff/admin");
        console.log("Blog rejected successfully");
      } else {
        setRejecting(false); // Set rejecting state back to false
        console.error("Failed to reject blog");
      }
    } catch (error) {
      setRejecting(false); // Set rejecting state back to false
      console.error("Error:", error);
    }
  };

  const handleReEdit = () => {
    navigate(`/staff/admin/edit/${blogDetails._id}`);
  };

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading blog details...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="relative">
          <button
            onClick={goBack}
            className="absolute top-0 left-0 flex items-center text-gray-600 hover:text-gray-900 transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back
          </button>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-12">
          <div className="relative">
            {blogDetails.image ? (
              <img
                src={blogDetails.image}
                alt="Post"
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {blogDetails.title}
            </h1>
            <div className="flex justify-between items-center text-gray-600 text-sm mb-6">
              <p>Author: {blogDetails.author}</p>
              <p>Category: {blogDetails.category}</p>
            </div>
            <div
              className="text-gray-700 text-base leading-6"
              dangerouslySetInnerHTML={{ __html: blogDetails.content }}
            />
          </div>
          <div className="flex justify-center gap-4 p-6 bg-gray-50">
            <button
              onClick={handleApprove}
              className={`px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition ${
                approving && "opacity-50 cursor-not-allowed"
              }`}
              disabled={approving}
            >
              {approving ? (
                <TailSpin
                  visible={true}
                  height="20"
                  width="20"
                  color="#ffffff"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                "Approve"
              )}
            </button>

            <button
              onClick={handleReject}
              className={`px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition ${
                rejecting && "opacity-50 cursor-not-allowed"
              }`}
              disabled={rejecting}
            >
              {rejecting ? (
                <TailSpin
                  visible={true}
                  height="20"
                  width="20"
                  color="#ffffff"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                "Reject"
              )}
            </button>

            <button
              onClick={handleReEdit}
              className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition`}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleBlog;
