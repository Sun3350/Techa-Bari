
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function StaffSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome, Staff!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default StaffSection;
