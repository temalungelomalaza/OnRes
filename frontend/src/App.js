import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Base from './Admin side/Base';
import Home from './Admin side/Welcome';
import Profile from './Admin side/Profile';
import Report from './Admin side/Report';
import Register from './Admin side/Register';
import AdminBase from './Pages/Pages/Admin/AdminBase';
import Users from './Pages/Pages/Admin/AdminProfile';
import Tickets from './Pages/Pages/Admin/Tickets';
import UserCredits from './Pages/Pages/Admin/UserCredits.js';
import api from './Authentication/API';

function App() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate()
  const location = useLocation();

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/current_user');
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    }
  };

  // Check for token and fetch user on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {  // Fetch user only if not already fetched
      fetchUser();
    }
  }, [user]);  // Run only when user state changes

  useEffect(() => {
    // Save the current path to localStorage on route change
    localStorage.setItem('lastVisitedPage', location.pathname);
  }, [location]);

  useEffect(() => {
    const lastPage = localStorage.getItem('lastVisitedPage');
    if (lastPage) {
      navigate(lastPage);  // Redirect to the last visited page
    }
  }, [navigate]);
  

  // Handle login functionality
  const handleLogin = async (email, password) => {
    try {
        
        const response = await api.post('/login', { email, password });

        const { access_token, refresh_token } = response.data;
        if (access_token && refresh_token) {
            // Save both tokens
            localStorage.setItem('token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            console.log('Tokens saved');

            // Fetch user data
            const { data: userData } = await api.get('/current_user');
            setUser(userData); 
            console.log('Fetched User:', userData);

            // Redirect user based on role
            if (userData.is_admin) {
                navigate('/admin/users');
            } else {
                navigate('/student/profile');
            }
        }
    } catch (error) {
        if (error.response?.status === 401) {
            alert('Invalid username or password');
        } else {
            console.error('Login failed:', error);
            alert('An error occurred. Please try again.');
        }
    }
};

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token');  // Ensure the correct token is removed
    setUser(null);
    navigate('/'); // Redirect to login page
    console.log('Logged out');
  };

  return (
        <Routes>
          <Route path='/' element={!user ? (<Home onLogin={handleLogin}/>) : (<Navigate to={user.is_admin ? "/admin/users" : "/student/profile"} />)} />
          <Route path='/register' element={<Register/>}/>
          <Route path='/student' element={user && !user.is_admin ? <Base onLogout={handleLogout} /> : <Navigate to="/" />}>
            <Route path='profile' element={<Profile />} />
            <Route path='report' element={<Report />} />
          </Route>
          <Route path='/admin' element={user && user.is_admin ? <AdminBase onLogout={handleLogout} /> : <Navigate to="/" />}>
            <Route path='users' element={<Users/>}/>
            <Route path='tickets' element={<Tickets/>}/>
            <Route path='user_credits' element={<UserCredits/>}/>
          </Route>
        </Routes>
  );
}

export default App;

