import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/login', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': `${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Token validation failed');
          }

          const user = await response.json();
          console.log('User details:', user);

          setIsLoggedIn(true);
          setUserRole(user.role);
          setUsername(user.name);
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      }
    };

    checkToken();
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, password: password }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to Login: ${error}`);
      }

      const { token, user } = await response.json();
      console.log('Token:', token);
      console.log('User:', user);
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setUserRole(user.role);

      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole('');
    setUsername('');
    navigate('/login');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {!isLoggedIn ? (
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
              name="username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select your role</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div className="form-group">
            <button type="submit" className="login-button">Login</button>
          </div>
        </form>
      ) : (
        <div className="dashboard-wrapper">
          <div className="welcome-box">
            <h3>Welcome, {username}</h3>
            <p>You are logged in as {userRole}</p>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
