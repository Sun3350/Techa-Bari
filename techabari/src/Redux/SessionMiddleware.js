const ADMIN_INACTIVITY_DURATION = 30 * 60 * 1000; // 30 minutes
const STAFF_INACTIVITY_DURATION = 6 * 60 * 60 * 1000; // 6 hours

const inactivityMiddleware = ({ dispatch, getState }) => {
  console.log("Inactivity middleware initialized");

  let inactivityTimer = null;

  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      console.log("Clearing previous inactivity timer.");
      clearTimeout(inactivityTimer);
    }

    const { role } = getState().auth || {}; // Assuming user role is stored in Redux state
    const timeoutDuration = role === "staff" ? STAFF_INACTIVITY_DURATION : ADMIN_INACTIVITY_DURATION;

    console.log(`Setting a new inactivity timer for ${role}. Duration: ${timeoutDuration / 1000 / 60} minutes`);

    inactivityTimer = setTimeout(() => {
      console.log(`Inactivity duration exceeded for ${role}. Logging out...`);

      if (role === "admin") {
        dispatch({ type: "ADMIN_LOGOUT" });
        localStorage.removeItem("adminToken");
      } else if (role === "staff") {
        dispatch({ type: "STAFF_LOGOUT" });
        localStorage.removeItem("token");
      }
    }, timeoutDuration);
  };

  const handleUserActivity = () => {
    console.log("User activity detected. Resetting inactivity timer.");
    resetInactivityTimer();
  };

  // Listen for user activity events
  window.addEventListener("mousemove", handleUserActivity);
  window.addEventListener("keydown", handleUserActivity);
  window.addEventListener("click", handleUserActivity);

  return (next) => (action) => {
    console.log("Middleware received action:", action.type);

    if (action.type === "ADMIN_LOGIN" || action.type === "STAFF_LOGIN") {
      console.log(`${action.type} detected. Starting inactivity timer.`);
      resetInactivityTimer();
    }

    if (action.type === "ADMIN_LOGOUT" || action.type === "STAFF_LOGOUT") {
      console.log(`${action.type} detected. Clearing inactivity timer.`);
      clearTimeout(inactivityTimer);
    }

    return next(action);
  };
};

export default inactivityMiddleware;
