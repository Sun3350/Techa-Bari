//import React, { useState } from 'react';
//import { IoSettingsOutline } from 'react-icons/io5';
//import { motion, AnimatePresence } from 'framer-motion';
//import { Link, useLocation } from 'react-router-dom';
//import { FaHome, FaUser, FaCog, FaAngleDoubleLeft, FaAngleDoubleRight, FaBlog, FaBlogger, FaRocketchat } from 'react-icons/fa';
//import './staff.css';
//import { CiLogout } from "react-icons/ci";
//import { MdPostAdd } from "react-icons/md";
//import { useDispatch } from 'react-redux';
//import { useNavigate } from 'react-router-dom';
//import StaffSection from './Home/StaffHome';
//
//
//const Admin = ({ children}) => {  // Add children to function parameters
//  const [isExpanded, setIsExpanded] = useState(true);
//  const location = useLocation();
//  
//  const toggleSidebar = () => {
//    setIsExpanded(!isExpanded);
//  };
//
//  const sidebarItems = [
//    { path: '/staff/me', name: 'Home', icon: <FaHome /> },
//    { path: '/staff/create', name: 'Post Blog', icon: <FaBlogger /> },
//    { path: '/staff/draft', name: 'Draft', icon: <MdPostAdd />    },
//    { path: '/staff/all-blog-posted', name: 'All Blogs', icon: <FaBlog /> },
//    { path: '/admin', name: 'Admin', icon: <FaRocketchat /> }
//  ];
//
//  const sidebarVariant = {
//    hidden: { x: -100, opacity: 0 },
//    visible: (i) => ({
//      x: 0,
//      opacity: 1,
//      transition: { delay: i * 0.1, duration: 0.4 }
//    })
//  };
//
//  const contentVariant = {
//    hidden: { opacity: 0 },
//    visible: { opacity: 1, transition: { duration: 0.3 } }
//  };
//
//  // Default content for the staff dashboard
//  const dispatch = useDispatch();
//  const navigate = useNavigate();
//
//  const handleLogout = () => {
//    dispatch({ type: 'LOGOUT' });
//    localStorage.removeItem('token');
//    navigate('/');
//  };
//  // Render the modal if chatName is not set
//  
//  return (
//    <div>
//      <div className='header w-full flex h-16 justify-between items-center bg-[#070707] px-10'>
//        <a className='text-[#ffffff] font-bold uppercase' href="/">staff Dashboard</a>
//        <div className='flex justify-center items-center'>
//          <div className='text-white mr-5'><IoSettingsOutline /></div>
//          <div className='text-white'><FaUser/></div>
//        </div>
//      </div>    
//
//      <div className='dashboard-container'>
//        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
//        {window.innerWidth > 660 && (
//            <div className="sidebar-toggle" onClick={toggleSidebar}>
//              {isExpanded ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
//            </div>
//          )}
//          
//          <ul>
//            {sidebarItems.map((item, index) => (
//              <motion.li
//                key={item.name}
//                custom={index}
//                variants={sidebarVariant}
//                initial="hidden"
//                animate="visible"
//                className={location.pathname === item.path ? 'active' : ''}
//              >
//                <Link to={item.path}>
//                  {item.icon}
//                  {isExpanded && <motion.span>{item.name}</motion.span>}
//                </Link>
//              </motion.li>
//            ))}
//          </ul>
//            <motion.li 
//            variants={sidebarVariant}
//            initial="hidden"
//            animate="visible"
//            >
//              <div onClick={handleLogout} className='font-bold text-1xl flex'> 
//                <CiLogout className='font-bold text-2xl mr-4'/>{isExpanded && <motion.span>Logout</motion.span>}
//              </div>
//            </motion.li>
//        </div>
//
//        <AnimatePresence>
//          <motion.div
//            className="content"
//            key={location.pathname}  
//            initial="hidden"
//            animate="visible"
//            exit="hidden"
//            variants={contentVariant}
//          >
//            {/* Render DefaultContent if no children are provided */}
//            {location.pathname === '/staff' || !children ? <StaffSection /> : children}
//          </motion.div>
//        </AnimatePresence>
//      </div>
//    </div>
//  );
//};
//
//export default Admin;