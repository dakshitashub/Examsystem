// import  from 'react';
import SubjectItem from './SubjectItem';
import './SubjectList.css'
const SubjectList = ({ subjects, onEdit, onDelete }) => {
  return (
    <div className="subject-list">
      {subjects.map((subject) => (
        <SubjectItem key={subject._id} subject={subject} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default SubjectList;
