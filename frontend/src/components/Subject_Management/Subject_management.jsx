import React, { useState, useEffect } from 'react';
import SubjectForm from './SubjectForm.jsx';
import SubjectList from './SubjectList.jsx';
import './SubjectManagement.css';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/subjects');
      if (!response.ok) throw new Error('Failed to fetch subjects');
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSaveSubject = async (subject) => {
    try {
      const method = selectedSubject ? 'PATCH' : 'POST';
      const url = selectedSubject
        ? `http://localhost:3000/api/subjects/${selectedSubject._id}`
        : 'http://localhost:3000/api/subjects';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subject),
      });
      if (!response.ok) throw new Error('Failed to save subject');
      setSelectedSubject(null);
      setShowForm(false);
      fetchSubjects();
    } catch (error) {
      console.error('Error saving subject:', error);
    }
  };

  const handleEditSubject = (subject) => {
    setSelectedSubject(subject);
    setShowForm(true);
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/subjects/${subjectId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to delete subject');
      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setSelectedSubject(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedSubject(null);
  };

  return (
    <div className="subject-management">
      <div className="box" onClick={toggleForm}>
        <h2>{showForm ? 'Close Form' : 'Add New Subject'}</h2>
      </div>
      <div className="box">
        <h2>Subject List</h2>
        <SubjectList
          subjects={subjects}
          onEdit={handleEditSubject}
          onDelete={handleDeleteSubject}
        />
      </div>
      {showForm && (
        <div className="form-container">
          <SubjectForm
            onSave={handleSaveSubject}
            existingSubject={selectedSubject}
            onClose={handleCloseForm} // Pass the onClose prop
          />
        </div>
      )}
    </div>
  );
};

export default SubjectManagement;
