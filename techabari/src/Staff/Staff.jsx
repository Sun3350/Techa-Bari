import React, { useState, useEffect } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdPending } from "react-icons/md";
import { FaHome, FaUser, FaCog, FaAngleDoubleLeft, FaAngleDoubleRight, FaBlog, FaBlogger, FaRocketchat, FaChartBar, FaCommentAlt, FaPen } from 'react-icons/fa';
import './staff.css';
import { CiLogout } from "react-icons/ci";
import { MdPostAdd } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import StaffSection from './Home/StaffHome';
import AdminLoginModal from '../Admin/AdminLogin/AdminLogin'; // Import the AdminLoginModal component
import { ADMIN_LOGOUT } from '../Redux/authReducer';
import { RiChatAiFill } from "react-icons/ri";
import axiosInstance from '../utils/axiosConfig';


const Staff = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Track admin login status
  const [isAdminStatus, setIsAdminStatus] = useState(false); // Track admin login status
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginTime = useSelector(state => state.auth.loginTime); // Accessing loginTime from Redux state
  const showLoginModal = useSelector((state) => state.auth.showLoginModal);


  //Notification Declaration 

  const [notificationCount, setNotificationCount] = useState(0);

  const checkAdminAndNotifications = async () => {
    try {
        console.log("Checking admin status...");

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token not found");
            throw new Error('Token not found');
        }

        const response = await axiosInstance.get(`/api/auth/user/isAdmin`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Admin status response:", response.data);
        setIsAdminStatus(response.data.isAdmin);

        if (response.data.isAdmin) {
          const notifications = await axiosInstance.get('/api/notification/notifications/count');
          const count = notifications.data.count || 0;
          setNotificationCount(count);
          console.log("notificationCount:", count);
        } else {
            console.log("User is not an admin, skipping notifications fetch.");
        }
    } catch (error) {
        console.error("Error occurred:", error.message);
        setIsAdminStatus(false);
        setNotificationCount(0);
    }
};

useEffect(() => {
  checkAdminAndNotifications();
}, [isAdminStatus]); // Re-fetch if `isAdminStatus` changes



  // Check if the admin token is present in localStorage
  useEffect(() => {
    const storedAdminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!storedAdminToken);

    // Fetch notifications only if user is admin
  
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const lastActivityTime = loginTime; // Get login time from Redux state

      if (currentTime - lastActivityTime >= 3600000) { // 1 hour inactivity
        dispatch({ type: ADMIN_LOGOUT }); // Dispatch logout action after inactivity
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [dispatch, loginTime]);

  // Log out admin if navigates outside '/staff' paths
  useEffect(() => {
    if (!location.pathname.startsWith('/staff')) {
      setIsAdmin(false);
      localStorage.removeItem('adminToken');
    }
  }, [location]);

  // Handle logout based on whether admin is logged in or not
  const handleLogout = () => {
    if (isAdmin) {
      dispatch({ type: 'ADMIN_LOGOUT' });
      localStorage.removeItem('adminToken');
      setIsAdmin(false);
      navigate('/staff/me'); // Redirect to staff page after admin logout
    } else {
      // Log out staff
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('token');
      navigate('/'); // Redirect to home page after staff logout
    }
  };

  const closeModal = () => {
    dispatch({ type: 'HIDE_LOGIN_POPUP' });
  };

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const sidebarItems = [
    { path: '/staff/me', name: 'Home', icon: <FaHome /> },
    { path: '/staff/create', name: 'Post Blog', icon: <FaPen />},
    { path: '/staff/draft', name: 'Draft', icon: <MdPostAdd /> },
    { path: '/staff/chat', name: 'Chat', icon: <FaCommentAlt />},
    {
      path: isAdminStatus ? '/staff/admin' : '#', // Disable navigation for non-admin
      name: 'Admin',
      icon: (
        <div className="relative">
          <FaUser  />
          {
           isAdminStatus && (
        <span className="absolute top-0 left-20 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex justify-center items-center">
          {notificationCount}
        </span>
      
  
  )
}

        </div>
      ),
      className: isAdminStatus
        ? 'cursor-pointer text-gray-700' // Enabled state
        : 'cursor-not-allowed text-gray-400', // Disabled state
      action: isAdminStatus ? undefined : (e) => e.preventDefault(), // Prevent action for non-admin
    }
,    
    ...(isAdmin
      ? [
          { path: '/staff/admin/unapproved', name: 'Pendings', icon: <MdPending />          },
          { path: '/staff/admin/approved', name: 'Manage Users', icon: <FaUser /> },
          { path: '/admin/settings', name: 'Admin Settings', icon: <FaCog /> },
        ]
      : []),
  ];
  

  const sidebarVariant = {
    hidden: { x: -100, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const contentVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div>
      <div className="header w-full flex h-16 justify-between items-center bg-[--container-background] px-10">
        <a className="text-[var(--text-color)] font-bold uppercase" href="/">
          {isAdmin ? (<a className="text-[var(--text-color)] font-bold uppercase" href="/staff/me">Admin Dashboard</a>
          ) : (<a className="text-[var(--text-color)] font-bold uppercase" href="/">Staff Dashboard</a>)}
        </a>
        <div className="flex justify-center items-center ">
          <div className="text-[var(--text-color)] mr-5">
            <IoSettingsOutline />
          </div>
          <div className="text-[var(--text-color)]">
            <FaUser />
          </div>
          <a href="/chat" target="_blank" className='chatAi bg-blue-600 text-white rounded hover:bg-blue-700 transition'>Try AI <RiChatAiFill style={{marginLeft:'10px'}}/>
          </a>
        </div>
      </div>

      <div className="dashboard-container ">
        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} `}>
          {window.innerWidth > 660 && (
            <div className="sidebar-toggle" onClick={toggleSidebar}>
              {isExpanded ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
            </div>
          )}

          <ul>
            {sidebarItems.map((item, index) => (
              <motion.li
                key={item.name}
                custom={index}
                variants={sidebarVariant}
                initial="hidden"
                animate="visible"
                className={location.pathname === item.path ? 'active' : ''}
                onClick={item.action} // Trigger action for admin button
              >
                {item.path !== '#' ? (
                  <Link className='w-full h-full py-[15px] px-[10px] ' to={item.path}>
                    {item.icon}
                    {isExpanded && <motion.span className='font-[500] text[0.8rem] ml-[10px] w-[100%] h-[100%]  '>{item.name}</motion.span>}
                  </Link>
                ) : (
                  <div className='flex items-center ml-2'>
                    {item.icon}
                    {isExpanded && <motion.span className='font-[500] text-[0.8rem] ml-[10px] w-full h-full'>{item.name}</motion.span>}
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
          <motion.li variants={sidebarVariant} initial="hidden" animate="visible">
            <div onClick={handleLogout} className="font-bold text-1xl flex">
              <CiLogout className="font-bold text-1xl mr-4" />
              {isAdmin
                ? isExpanded && <motion.span className='text-[0.8rem] font-[500]'>Logout Admin</motion.span>
                : isExpanded && <motion.span className='text-[0.8rem] font-[500]'>Logout Staff</motion.span>}
            </div>
          </motion.li>
        </div>

        <AnimatePresence>
          <motion.div
            className="content"
            key={location.pathname}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariant}
          >
            {location.pathname === '/staff' || !children ? <StaffSection /> : children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Admin Login Modal */}
      {showLoginModal && (
        <AdminLoginModal
          isOpen={showLoginModal}
          onClose={closeModal}
          onLoginSuccess={closeModal}
        />
      )}
    </div>
  );
};

export default Staff;
