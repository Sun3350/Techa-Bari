import React, { useState, useEffect } from 'react';
import './createBlog.css';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosConfig';
import { useNotification } from '../Notification/NotificationContext';

const API_BASE_URL = 'http://localhost:5000';

const CreateBlog = () => {
  const { id: postId } = useParams(); // Get ID from URL parameters (blog or draft)
  const navigate = useNavigate();
  const isDraftMode = window.location.pathname.includes('draft');
  const mode = postId ? 'edit' : 'create';
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image: null,
    imageDesc: ''
  });

  const categories = [
    "FinTech",
    "Artificial Intelligence",
    "Machine Learning",
    "Cybersecurity",
    "Cloud Computing",
    "Blockchain",
    "Internet of Things (IoT)",
    "Augmented Reality (AR)",
    "Virtual Reality (VR)",
    "Data Science",
    "Big Data",
    "Quantum Computing",
    "DevOps",
    "Web Development",
    "Mobile App Development",
    "Software Engineering",
    "Programming Languages",
    "Game Development",
    "Open Source",
    "Tech Reviews",
    "Startups & Entrepreneurship",
    "Networking",
    "Gadgets & Hardware",
    "UI/UX Design",
    "Automation & Robotics",
    "5G & Future Technologies",
  ]

  const [imagePreview, setImagePreview] = useState('');
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (mode === 'edit') {
      fetchItemData();
    }

    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [mode, hasUnsavedChanges]);

  const fetchItemData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = isDraftMode
        ? `/api/blogger/drafts/${postId}`
        : `/api/blogger/posts/${postId}`;

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { title, content, category, image, imageDesc } = response.data;

      setFormData({
        title: title || '', 
        content: content || '',
        category: category || '',
        image: null,
        ImageDesc: imageDesc || '',
      });

      setImagePreview(image);
    } catch (error) {
      showNotification(`Error fetching data: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setHasUnsavedChanges(true);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setFormData({ ...formData, image: selectedImage });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(selectedImage);
    }
    setHasUnsavedChanges(true);
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
    setHasUnsavedChanges(true);
  };

  const validateForm = () => {
    if (!formData.title || !formData.content || !formData.category || ! formData.imageDesc) {
      showNotification('All fields are required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (url, isDraft = false) => {
    if (!validateForm()) return;
    try {
      isDraft ? setSavingDraft(true) : setLoading(true);
      showNotification('');
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      data.append('imageDesc', formData.imageDesc);
      if (formData.image) data.append('image', formData.image);

      const endpoint = mode === 'edit' 
        ? `${url}/${postId}` 
        : url;

      const response = await axios({
        method: mode === 'edit' ? 'PUT' : 'POST',
        url: endpoint,
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        isDraft ? toast.success('Draft saved successfully') : toast.success('Blog saved successfully');
        setIsDraftSaved(true);
        setHasUnsavedChanges(false);
        if (!isDraft) navigate('/staff');
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      showNotification(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      isDraft ? setSavingDraft(false) : setLoading(false);
    }
  };

  return (
    <div className="create-container p-8">
      <div className="form-wrapper">
        <h2 className="uppercase text-xl font-semibold">
          {mode === 'edit' ? (isDraftMode ? 'Edit Draft' : 'Edit Post') : 'Create a Post'}
        </h2>
        <div className="flex w-full justify-between my-10">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="blog-input w-[60%] uppercase"
          />
                     <select
             name="category"
             value={formData.category}
             onChange={handleChange}
             className="blog-input w-[35%] cursor-pointer"
           >
             <option value="">Select Category</option>
             {categories.map((category, index) => (
               <option key={index} value={category}>
                 {category}
               </option>
             ))}
           </select>
           
        </div>

        <div className="flex items-center justify-center flex-col w-full mb-5">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center my-8 justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-[var(--container-background)]"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="dropzone-file"
            />
          </label>
          
          <input
            type="text"
            name="imageDesc"
            placeholder="Image Description"
            value={formData.imageDesc}
            onChange={handleChange}
            className=" w-[100%]  blog-input"
          />
        
          {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview rounded" />}
        </div>
        <div className="shadow-md p-5 rounded">
          <ReactQuill
            value={formData.content}
            onChange={handleContentChange}
            theme="snow"
            placeholder="Write your story here..."
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ font: [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ script: 'sub' }, { script: 'super' }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ align: [] }],
                ['link', 'image', 'video'],
                ['blockquote', 'code-block'],
                ['clean'],
              ],
            }}
            formats={[
              'header',
              'font',
              'size',
              'bold',
              'italic',
              'underline',
              'strike',
              'color',
              'background',
              'script',
              'list',
              'bullet',
              'indent',
              'align',
              'link',
              'image',
              'video',
              'blockquote',
              'code-block',
            ]}
          />
        </div>
        <div className="button-group">
          <button
            onClick={() => handleSubmit(
              `${API_BASE_URL}/api/blogger/${
                mode === 'edit'
                  ? isDraftMode
                    ? `updateDrafts` // For updating a draft
                    : `update/posts` // For updating a published post
                  : isDraftMode
                  ? 'createDrafts' // For creating a draft
                  : 'create' // For creating a new post
              }`,
              false
            )
            
            }
            disabled={loading}
            className="bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-md"
          >
            {loading ? <TailSpin height="20" width="20" color="#fff" /> : 'Publish'}
          </button>
          <button
            onClick={() =>
              handleSubmit(`${API_BASE_URL}/api/blogger/${isDraftMode ? 'updateDrafts' : 'create-draft'}`, true)
            }
            disabled={savingDraft}
            className="bg-gray-400 text-white rounded hover:bg-gray-500 transition shadow-md"
          >
            {savingDraft ? <TailSpin height="20" width="20" color="#fff" /> : 'Save as Draft'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
