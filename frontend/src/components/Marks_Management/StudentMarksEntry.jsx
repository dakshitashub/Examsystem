import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './StudentMarksEntry.css';

const StudentMarksEntry = ({ semesterId }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [marks, setMarks] = useState({});
  const [examScores, setExamScores] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/students/semester/${semesterId}`);
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [semesterId]);

  const openModal = (student) => {
    setSelectedStudent(student);
    setMarks({});
    setExamScores({});
    setSelectedSubjects([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (subjectId, value, type) => {
    if (type === 'ca') {
      setMarks({
        ...marks,
        [subjectId]: value,
      });
    } else if (type === 'exam') {
      setExamScores({
        ...examScores,
        [subjectId]: value,
      });
    }
  };

  const handleSubjectSelection = (subjectId) => {
    setSelectedSubjects((prevSelected) =>
      prevSelected.includes(subjectId)
        ? prevSelected.filter((id) => id !== subjectId)
        : [...prevSelected, subjectId]
    );
  };

  const handleMarksSubmit = async () => {
    try {
      const markEntries = selectedSubjects.map((subjectId) => {
        const caScore = parseFloat(marks[subjectId]) || 0;
        const examScore = parseFloat(examScores[subjectId]) || 0;
        const totalScore = 0.3 * caScore + 0.7 * examScore;

        return {
          subjectId,
          caScore,
          examScore,
          totalScore,
        };
      });

      await Promise.all(
        markEntries.map(({ subjectId, caScore, examScore, totalScore }) =>
          fetch(`http://localhost:3000/api/scores/student/${selectedStudent._id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subjectId, caScore, examScore, totalScore }),
          })
        )
      );

      alert('Marks added successfully!');
      closeModal();
    } catch (error) {
      console.error('Error adding marks:', error);
    }
  };

  return (
    <div className="student-marks-entry">
      <h2>Enter CA and Exam Marks for Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student._id}>
            {student.firstName} {student.lastName}
            <button onClick={() => openModal(student)}>Add CA and Exam Marks</button>
          </li>
        ))}
      </ul>

      {selectedStudent && (
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Add Marks">
          <button className="ReactModal__CloseButton" onClick={closeModal}>
            &times;
          </button>
          <h3>Add CA and Exam Marks for {selectedStudent.firstName} {selectedStudent.lastName}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleMarksSubmit();
            }}
          >
            {selectedStudent.subjects.map((subject) => (
              <div key={subject._id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject._id)}
                    onChange={() => handleSubjectSelection(subject._id)}
                  />
                  {subject.name}
                </label>
                {selectedSubjects.includes(subject._id) && (
                  <div>
                    <label>{subject.name} CA Marks:</label>
                    <input
                      type="number"
                      placeholder="Enter CA marks"
                      value={marks[subject._id] || ''}
                      onChange={(e) => handleInputChange(subject._id, e.target.value, 'ca')}
                    />
                    <br />
                    <label>{subject.name} Exam Marks:</label>
                    <input
                      type="number"
                      placeholder="Enter Exam marks"
                      value={examScores[subject._id] || ''}
                      onChange={(e) => handleInputChange(subject._id, e.target.value, 'exam')}
                    />
                  </div>
                )}
              </div>
            ))}
            <button type="submit">Submit Marks</button>
            <button type="button" onClick={closeModal}>
              Close
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudentMarksEntry;
