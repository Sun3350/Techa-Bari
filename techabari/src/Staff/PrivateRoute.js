// PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute({ children }) {
  const staffLoggedIn = useSelector((state) => state.auth.staffLoggedIn);

  if (!staffLoggedIn) {
    return <Navigate to="/staff" />;
  }

  return children;
}

export default PrivateRoute;
