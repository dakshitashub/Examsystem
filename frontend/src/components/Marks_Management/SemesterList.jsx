import { useState, useEffect } from 'react';
import './SemesterList.css';

const SemesterList = ({ onSelectSemester }) => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [action, setAction] = useState(null);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/semesters');
        const data = await response.json();
        setSemesters(data);
      } catch (error) {
        console.error('Error fetching semesters:', error);
      }
    };

    fetchSemesters();
  }, []);

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
  };

  const handleActionSelect = (selectedAction) => {
    setAction(selectedAction);
    onSelectSemester(selectedSemester.order, selectedAction);
  };

  return (
    <div className="semester-list-container">
      {!selectedSemester ? (
        <>
          <h2>Select a Semester</h2>
          <ul>
            {semesters.map(semester => (
              <li key={semester._id} onClick={() => handleSemesterSelect(semester)}>
                {semester.order} {semester.department} Semester
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="action-selection">
          <h2>{selectedSemester.order} {selectedSemester.department} Semester</h2>
          <p>Select an action:</p>
          <button onClick={() => handleActionSelect('addMarks')}>Add Marks</button>
          <button onClick={() => handleActionSelect('viewResults')}>View Results</button>
        </div>
      )}
    </div>
  );
};

export default SemesterList;
