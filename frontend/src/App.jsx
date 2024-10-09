
import { useEffect ,useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentEntry from './components/Entry/StudentEntry';
import LecturerEntry from './components/Entry/LecturerEntry ';
import SemesterEntry from './components/Entry/SemesterEntry';
import Login from './components/Login/Login';
import AdminDashboard from './components/Navbar/AdminDashboard';
import Home from './components/Home/Home';
import TeacherDashboard from './components/TeacherDashboard/TeacherDashboard';

// import React from 'react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   setIsLoggedIn(false);
    
  // };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <main>
        <Routes>
        <Route path="/" element={<Home  />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-student" element={<StudentEntry />} />
          <Route path="/add-lecturer" element={<LecturerEntry />} />
          <Route path="/add-semester" element={<SemesterEntry />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
