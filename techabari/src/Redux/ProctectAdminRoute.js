import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AdminLoginModal from '../Admin/AdminLogin/AdminLogin'; // Import your modal component

const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = useSelector((state) => state.auth.isAdminLoggedIn);
  const showLoginModal = useSelector((state) => state.auth.showLoginModal);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAdmin) {
      dispatch({ type: 'SHOW_LOGIN_POPUP' }); // Trigger the login modal popup
    }
  }, [isAdmin, dispatch]);

  const closeModal = () => {
    dispatch({ type: 'HIDE_LOGIN_POPUP' });
  };

  if (!isAdmin) {
    // Prevent rendering the protected page
    return (
      <div>
        {showLoginModal && (
          <AdminLoginModal
            isOpen={showLoginModal}
            onClose={closeModal}
            onLoginSuccess={closeModal}
          />
        )}
      </div>
    );
  }

  return children;
};

export default ProtectedAdminRoute;
