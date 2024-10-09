import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import SubjectManagement from '../Subject_Management/Subject_management.jsx';
import MarksEntryPage from '../Marks_Management/MarksEntryPage.jsx';
import './TeacherDashboard.css'
const TeacherDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/lecturers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleBackToHome = () => {
    navigate('/'); // Redirect to the home page
  };

  // Conditional rendering based on user role
  if (user === null) {
    return <div>Loading...</div>; // Optional: Show a loading state
  }

  return (
    <div>
      <button onClick={handleBackToHome} className="back-button">Back to Home</button> {/* Back to Home Button */}
      {user.role === 'Academic Coordinator' ? <SubjectManagement /> : <MarksEntryPage />}
    </div>
  );
};

export default TeacherDashboard;
