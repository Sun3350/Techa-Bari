// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserSection from './User/Home/Home';
import StaffSection from './Staff/Home/StaffHome';
import StaffLogin from './Staff/Login/Login';
import { ReduxProvider } from './utils/Store';
import PrivateRoute from './Staff/PrivateRoute';

function App() {
  return (
    <ReduxProvider>
      <Router>
        <Routes>
          <Route path="/" element={<UserSection />} />
          <Route path="/staff" element={<StaffLogin />} />
          <Route path="/staff/me" element={<PrivateRoute><StaffSection /></PrivateRoute>} />
        </Routes>
      </Router>
    </ReduxProvider>
  );
}

export default App;
