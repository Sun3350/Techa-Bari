import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';

function AdminEdit() {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Technology',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const pathnameArray = window.location.pathname.split('/');
        const postId = pathnameArray[pathnameArray.length - 1];

        if (postId) {
          const response = await axiosInstance.get(
            `/api/blogger/admin/posts/${postId}`
          );

          const postData = response.data;

          setFormData({
            title: postData.title || '',
            content: postData.content || '',
            category: postData.category || '',
            image: postData.image || '',
          });
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
        setError('Error fetching post data');
      }
    };

    fetchPostData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];

    setFormData((prevData) => ({
      ...prevData,
      image: imageFile,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    } else {
      setImagePreview(null);
    }
  };

  const handleUpdatePost = async () => {
    try {
      const pathnameArray = window.location.pathname.split('/');
      const postId = pathnameArray[pathnameArray.length - 1];
      const token = localStorage.getItem('token');
  
      setLoader(true);
  
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
  
      // ✅ Correcting single image upload
      if (formData.image) {
        data.append('image', formData.image);
      }
  
      const response = await axiosInstance.put(
        `/api/blogger/admin/update/posts/${postId}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data', 
          },
        }
      );
  
      if (response.status === 200) {
        setLoader(false);
        setResponseMessage('Blog post updated successfully');
        navigate('/staff/admin');
      } else {
        setLoader(false);
        setError('Error updating blog post');
      }
    } catch (error) {
      setLoader(false);
      setError('Error updating blog post: ' + error.message);
    }
  };
  

  return (
    <div className=" w-full bg-[var(--background-color)]  flex items-center justify-center">
      <div className="bg-[var(--background-color)]  shadow-lg rounded-lg p-6 w-full ">
        <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4">
          Edit Blog Post
        </h2>
        <div className="flex w-full justify-between my-10">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="blog-input w-[60%] uppercase p-2  "
            required
          />
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="blog-input w-[35%]"
            required
          >
            <option value="Technology">Technology</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
          </select>
        
        </div>
        <div class="flex items-center justify-center flex-col w-full">
    <label for="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  dark:hover:bg-gray-950  hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className='hidden'
          id="dropzone-file"
        />    
        </label>
        <div className="my-5 w-full h-60 flex items-center justify-center border border-gray-300 rounded-md">
          
            {imagePreview && (
              <img
                src={imagePreview}
                alt="New Image Preview"
                className="object-cover w-full h-full rounded-md"
              />
            )}
          </div>
</div> 

      
        <div className="my-4">
          <ReactQuill
            value={formData.content}
            onChange={(content) =>
              setFormData((prevData) => ({ ...prevData, content }))
            }
            theme="snow"
            placeholder="Tell the story"
            modules={{
              toolbar: [
                [{ font: [] }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ script: 'sub' }, { script: 'super' }],
                ['blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
                ['link', 'image', 'video'],
                ['clean'],
              ],
            }}
            className=" border  border-gray-300 rounded-md focus:outline-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleUpdatePost}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            disabled={loader}
          >
            {loader ? (
              <TailSpin
                visible={true}
                height="20"
                width="20"
                color="#ffffff"
                ariaLabel="tail-spin-loading"
              />
            ) : (
              'Update'
            )}
          </button>
        </div>
        {error && (
          <div className="mt-4 text-red-600 text-sm">{error}</div>
        )}
        {responseMessage && (
          <div className="mt-4 text-green-600 text-sm">{responseMessage}</div>
        )}
      </div>
    </div>
  );
}

export default AdminEdit;
