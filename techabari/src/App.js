import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch from redux
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import UserSection from './User/Home/Home';
import StaffSection from './Staff/Home/StaffHome';
import StaffLogin from './Staff/Login/Login';
import './App.css';
import ProtectedStaffRoute from './Redux/ProtectedStaffRoute';
import ProtectedAdminRoute from './Redux/ProctectAdminRoute';
import AdminHome from './Admin/AdminHome';
import Staff from './Staff/Staff';
import CreateBlog from './Staff/CreateBlog/CreateBlog';
import Draft from './Staff/Draft/Draft';
import UnpublishedBlogPosts from './Admin/AdminBlog/UnApprovedBlog';
import ApprovedBlog from './Admin/AdminBlog/ApprovedBlog';
import SingleBlog from './Admin/AdminBlog/SingleBlog';
import AdminEdit from './Admin/AdminBlog/AdminEdit';
import SinglePostPage from './Staff/SinglePage/SinglePage';
import ChatApp from './AiChat/TechabariAI';
import { loadUserFromToken } from './Redux/jwtAction';
import Notification from './Staff/Notification/Notification';
import ChatBoard from './Chat/ChatBoard';
import Header from './User/NavBar/Header'; // Import the Header component
import SinglePage from './User/SinglePage/SinglePage';
import Verification from './Pages/Subscriber/Verification';

function App() {
  const dispatch = useDispatch(); // Initialize Redux dispatch

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  useEffect(() => {
    // Define a function to dispatch activity reset
    const handleUserActivity = () => {
      dispatch({ type: 'UPDATE_LOGIN_TIME' }); // Dispatch action to reset inactivity timer
    };

    // Add event listeners for user interactions
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    return () => {
      // Cleanup event listeners on component unmount
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, [dispatch]); // Dependency array ensures effect runs when dispatch changes

  return (
    <Router>
      <Notification />
      <AppContent />
    </Router>
  );
}

const AppContent = () => {
  const location = useLocation();

  // Define the paths where you want to show the header
  const showHeader =
    location.pathname !== '/login' &&
    !location.pathname.startsWith('/staff') &&
    !location.pathname.startsWith('/admin') &&
    !location.pathname.startsWith('/chat');

  return (
    <>
      {showHeader && <Header />} {/* Render the header conditionally */}
      <Routes>
        <Route path="/" element={<UserSection />} />
        <Route path="/post/:id" element={<SinglePage />} />
        <Route path="/you" element={<StaffLogin />} />
        <Route path="/staff/*" element={<StaffLayout />} />
        <Route path="/chat" element={<ChatApp />} />
        <Route path="/verify" element={<Verification />} />
      </Routes>
    </>
  );
};

const StaffLayout = () => (
  <ProtectedStaffRoute>
    <Staff>
      <Routes>
        <Route path="/me" element={<StaffSection />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/chat" element={<ChatBoard />} />
        <Route path="/create/:id" element={<CreateBlog />} />
        <Route path="/single/:id" element={<SinglePostPage />} />
        <Route path="/draft" element={<Draft />} />
        <Route path="/admin" element={<ProtectedAdminRoute><AdminHome /></ProtectedAdminRoute>} />
        <Route path="/admin/unapproved" element={<ProtectedAdminRoute><UnpublishedBlogPosts /></ProtectedAdminRoute>} />
        <Route path="/admin/approved" element={<ProtectedAdminRoute><ApprovedBlog /></ProtectedAdminRoute>} />
        <Route path="/admin/edit/:postId" element={<ProtectedAdminRoute><AdminEdit /></ProtectedAdminRoute>} />
        <Route path="/admin/single/:postId" element={<ProtectedAdminRoute><SingleBlog /></ProtectedAdminRoute>} />
      </Routes>
    </Staff>
  </ProtectedStaffRoute>
);

export default App;
