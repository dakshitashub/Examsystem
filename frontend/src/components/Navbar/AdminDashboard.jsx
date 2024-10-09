import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file
import { useEffect } from 'react';

const AdminDashboard = () => {
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
          if(user.role === 'admin'){
            navigate('/admin-dashboard');
          } else {
            navigate('/teacher-dashboard');
          }

        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
        }
      } else {
        navigate('/');
      }
    };

    checkToken();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <button onClick={() => navigate('/add-student')} className="dashboard-button">
          Add Student
        </button>
      </div>
      <div className="dashboard-box">
        <button onClick={() => navigate('/add-lecturer')} className="dashboard-button">
          Add Lecturer
        </button>
      </div>
      <div className="dashboard-box">
        <button onClick={() => navigate('/add-semester')} className="dashboard-button">
          Add Semester
        </button>
      </div>
      <div className="dashboard-box">
        <button onClick={() => navigate('/')} className="dashboard-button">
          Home
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
