import './SubjectItem.css';

const SubjectItem = ({ subject, onEdit, onDelete }) => {
  return (
    <div className="subject-item">
      <div className="subject-details">
        <h3>{subject.name} ({subject.subjectCode})</h3>
        <p>Semester: {subject.semester}</p>
      </div>
      <div className="subject-item-buttons">
        <button className="edit-btn" onClick={() => onEdit(subject)}>Edit</button>
        <button className="delete-btn" onClick={() => onDelete(subject._id)}>Delete</button>
      </div>
    </div>
  );
};

export default SubjectItem;
