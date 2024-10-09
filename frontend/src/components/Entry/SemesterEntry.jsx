import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SemesterEntry.css';

const getOrdinalSuffix = (number) => {
  const j = number % 10;
  const k = number % 100;
  if (j === 1 && k !== 11) {
    return `${number}st`;
  }
  if (j === 2 && k !== 12) {
    return `${number}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${number}rd`;
  }
  return `${number}th`;
};

const SemesterEntry = () => {
  const [semester, setSemester] = useState({ order: '', startDate: '', endDate: '', department: '' });
  const [departments, setDepartments] = useState(['ENGINEERING', 'COMPUTER APPLICATIONS', 'SCIENCE']);
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
    setSemester({ ...semester, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/semesters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(semester),
      });
      if (!response.ok) {
        throw new Error('Failed to create semester');
      }
      setSemester({ order: '', startDate: '', endDate: '', department: '' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Semester Entry</h2>
      <select name="order" value={semester.order} onChange={handleChange} required>
        <option value="">Select Semester</option>
        {[...Array(10).keys()].map(i => (
          <option key={i + 1} value={i + 1}>
            {getOrdinalSuffix(i + 1)} Semester
          </option>
        ))}
      </select>
      <input
        type="date"
        name="startDate"
        value={semester.startDate}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="endDate"
        value={semester.endDate}
        onChange={handleChange}
        required
      />
      <select name="department" value={semester.department} onChange={handleChange} required>
        <option value="">Select Department</option>
        {departments.map(department => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>
      <button type="submit">Add Semester</button>
    </form>
  );
};

export default SemesterEntry;
