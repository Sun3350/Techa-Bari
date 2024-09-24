// StaffLogin.js
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function StaffLogin() {
  const [staffID, setStaffID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (staffID === 'staff' && password === 'password') {
      dispatch({ type: 'LOGIN' });
      navigate('/staff/me');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Staff Login</h2>
      <input type="text" placeholder="Staff ID" value={staffID} onChange={(e) => setStaffID(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default StaffLogin;
