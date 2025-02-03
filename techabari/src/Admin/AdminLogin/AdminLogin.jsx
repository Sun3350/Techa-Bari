import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosConfig';
import { ADMIN_LOGIN, ADMIN_LOGOUT, UPDATE_LOGIN_TIME } from '../../Redux/authReducer';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEyeSlash, FaEye, FaSpinner} from 'react-icons/fa';
import './adminLogn.css'
import { useNotification } from "../../Staff/Notification/NotificationContext";

const AdminLogin = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const loginTime = useSelector(state => state.auth.loginTime);

  const cancel = () => {
    dispatch({ type: 'HIDE_LOGIN_POPUP' });
    navigate('/staff/me');
  };

  const handleAdminLogin = async () => {
    setLoading(true);
   showNotification(null);
    try {
      const response = await axiosInstance.post('/api/auth/admin-login', {
        username,
        password,
      });

      if (response.data?.token) {
        const user = { username: response.data.username };
        localStorage.setItem('adminToken', response.data.token);
        dispatch({ type: ADMIN_LOGIN, payload: { user } });
        dispatch({ type: UPDATE_LOGIN_TIME, payload: { time: Date.now() } });
        showNotification('Admin Login Successfully')
        onClose();
        onLoginSuccess();
        setIsAdmin(true);
        dispatch({ type: 'HIDE_LOGIN_POPUP' });
      } else {
        setError('Invalid credentials');
        cancel();
      }
    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
      cancel();
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const lastActivityTime = loginTime;

      if (currentTime - lastActivityTime >= 3600000) {
        dispatch({ type: ADMIN_LOGOUT });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, loginTime]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-[var(--container-background)] p-6 rounded-lg shadow-md w-full max-w-md relative">
        <h2 className="text-xl font-bold text-center mb-4">Admin Login</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        
        <div className="relative my-6">
          <FaUser className="absolute inset-y-2 left-3 text-gray-400 flex items-center" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10 p-2 border w-full focus:outline-none admin-input"
          />
        </div>

        <div className="relative mb-4">
      <FaLock className="absolute inset-y-2 left-3 text-gray-400 flex items-center" />
      <input
        type={showPassword ? "text" : "password"} // Toggle input type
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="pl-10 p-2 border w-full focus:outline-none admin-input"
      />
      <div
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none cursor-pointer"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle icon */}
      </div>
    </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={handleAdminLogin}
           
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
              loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
          {loading ? (
            <FaSpinner className="animate-spin text-xl" />
          ) : (
            'Login'
          )}          
          </button>
          <button
            onClick={cancel}
            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition '
            
          >
          Cancle
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
