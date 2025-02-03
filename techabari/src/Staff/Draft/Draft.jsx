import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './draft.css';
import axiosInstance from '../../utils/axiosConfig';
import { TextLoader } from '../../utils/Loader';
import { useNotification } from "../Notification/NotificationContext";

function Draft() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();
  

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch drafts from the backend
        const response = await axiosInstance.get(`/api/blogger/drafts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDrafts(response.data);
      } catch (error) {
        showNotification('Error fetching drafts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  return (
    <div className='draft-container p-8'>
      <h2 className='text-xl font-semibold uppercase'>Drafts</h2>
      <div className='w-full flex items-center justify-center'>
      {loading && <TextLoader
          messages={['Loading your blogs...', 'Fetching data...']}
          direction="vertical"
        />}
      {!loading && drafts.length === 0 && <p>No drafts available.</p>}
      {!loading && drafts.length > 0 && (
        <ul>
          {drafts.map((draft) => (
            <div key={draft._id} className='draft-card'>
              <Link to={`/create-blog/${draft._id}`} className='draft--card'>
                <button className='draft-button'>
                  {draft.title}
                </button>
              </Link>
            </div>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}

export default Draft;
