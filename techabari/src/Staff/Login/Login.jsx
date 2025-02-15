import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import { AiOutlineUser, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';
import { useNotification } from "../Notification/NotificationContext";

function StaffLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showNotification } = useNotification();

  const handleLogin = async () => {
    setLoading(true);
   showNotification(null);

    try {
      const response = await axiosInstance.post('/api/auth/login', {
        username,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        dispatch({ type: 'STAFF_LOGIN', payload: { token: response.data.token } });
        showNotification('Login Succesfully')
        navigate('/staff/me');
      } else {
       showNotification('Invalid credentials');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
       showNotification(err.response.data.message);
      } else {
       showNotification('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)] flex items-center justify-center">
      <div className="bg-[var(--container-background)] shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[var(--text-color)] mb-6 uppercase">Staff Login</h2>

        <div className="mb-6 relative">
          <AiOutlineUser className="absolute left-3 top-3.5 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Staff ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-10 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-8 relative">
          <AiOutlineLock className="absolute left-3 top-3.5 text-gray-400 text-xl" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-10 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            type="button"
            className="absolute right-3 top-3.5 text-gray-400 text-xl focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 m-0 text-white rounded-lg flex justify-center items-center ${
            loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {loading ? (
            <FaSpinner className="animate-spin text-xl" />
          ) : (
            'Login'
          )}
        </button>

      </div>
    </div>
  );
}

export default StaffLogin;
