const INACTIVITY_DURATION = 30 * 60 * 1000; // 10 minutes

const inactivityMiddleware = ({ dispatch }) => {
    console.log('Inactivity middleware initialized'); // Debugging start

  let inactivityTimer = null;

  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      console.log('Clearing previous inactivity timer.');
      clearTimeout(inactivityTimer);
    }

    console.log('Setting a new inactivity timer.');
    inactivityTimer = setTimeout(() => {
      console.log('Inactivity duration exceeded. Logging out...');
      alert('You have been inactive for too long. Logging out...');
      dispatch({ type: 'ADMIN_LOGOUT' });
      localStorage.removeItem('adminToken'); // Clear stored token on inactivity
    }, INACTIVITY_DURATION);
  };

  return (next) => (action) => {
    console.log('Middleware received action:', action.type);

    if (action.type === 'ADMIN_LOGIN') {
      console.log('Admin login detected. Starting inactivity timer.');
      resetInactivityTimer();
    }

    if (action.type === 'ADMIN_LOGOUT') {
      console.log('Admin logout detected. Clearing inactivity timer.');
      clearTimeout(inactivityTimer);
    }

    // Reset inactivity timer on any user activity except specific actions
   
    return next(action);
  };
};

export default inactivityMiddleware;
