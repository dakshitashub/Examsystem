import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LecturerEntry.css';

const predefinedRoles = [
  { id: '1', name: 'Academic Coordinator' },
  { id: '2', name: 'Instructor' },
  // { id: '3', name: 'Exam Coordinator' },
];

const LecturerEntry = () => {
  const navigate = useNavigate();
  const [lecturer, setLecturer] = useState({ firstName: '', lastName: '', lecturerId: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/login', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': token,
            },
          });

          if (!response.ok) {
            throw new Error('Token validation failed');
          }

          const user = await response.json();
          if (user.role !== 'admin') {
            navigate('/');
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    checkToken();
  }, [navigate]);

  const handleChange = (e) => {
    setLecturer({ ...lecturer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/lecturers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lecturer),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create lecturer: ${error}`);
      }

      setLecturer({ firstName: '', lastName: '', lecturerId: '', role: '' });
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lecturer-container">
      <h2>Lecturer Entry</h2>
      <form onSubmit={handleSubmit} className="lecturer-form">
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          name="firstName"
          value={lecturer.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="lastName"
          value={lecturer.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <input
          type="text"
          name="lecturerId"
          value={lecturer.lecturerId}
          onChange={handleChange}
          placeholder="Lecturer ID"
          required
        />
        <select name="role" value={lecturer.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          {predefinedRoles.map(role => (
            <option key={role.id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding Lecturer...' : 'Add Lecturer'}
        </button>
      </form>
    </div>
  );
};

export default LecturerEntry;
