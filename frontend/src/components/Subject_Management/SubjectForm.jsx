import { useState, useEffect } from 'react';
import './SubjectForm.css';

const SubjectForm = ({ onSave, existingSubject, onClose }) => {
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [semester, setSemester] = useState('');
  const [departments] = useState(['ENGINEERING', 'COMPUTER APPLICATIONS', 'SCIENCE']);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [units, setUnits] = useState([{ number: '', name: '', description: '' }]);

  useEffect(() => {
    if (existingSubject) {
      setSubjectName(existingSubject.name);
      setSubjectCode(existingSubject.subjectCode);
      setSemester(existingSubject.semester);
      setSelectedDepartment(existingSubject.department);
      setUnits(existingSubject.units);
    }
  }, [existingSubject]);

  const handleUnitChange = (index, e) => {
    const { name, value } = e.target;
    const updatedUnits = [...units];
    updatedUnits[index][name] = value;
    setUnits(updatedUnits);
  };

  const handleAddUnit = () => {
    setUnits([...units, { number: '', name: '', description: '' }]);
  };

  const handleRemoveUnit = (index) => {
    const updatedUnits = units.filter((_, i) => i !== index);
    setUnits(updatedUnits);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = { name: subjectName, subjectCode, semester, department: selectedDepartment, units };
    onSave(subject);
  };

  return (
    <form onSubmit={handleSubmit} className="subject-form">
      <div className="form-group">
        <label>Subject Name</label>
        <input type="text" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Subject Code</label>
        <input type="text" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Semester</label>
        <input type="number" value={semester} onChange={(e) => setSemester(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Department</label>
        <select name="department" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} required>
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {units.map((unit, index) => (
        <div key={index} className="unit-group">
          <h4>Unit {index + 1}</h4>
          <div className="form-group">
            <label>Unit Number</label>
            <input
              type="number"
              name="number"
              value={unit.number}
              onChange={(e) => handleUnitChange(index, e)}
              required
            />
          </div>
          <div className="form-group">
            <label>Unit Name</label>
            <input
              type="text"
              name="name"
              value={unit.name}
              onChange={(e) => handleUnitChange(index, e)}
              required
            />
          </div>
          <div className="form-group">
            <label>Unit Description</label>
            <textarea
              name="description"
              value={unit.description}
              onChange={(e) => handleUnitChange(index, e)}
              required
            />
          </div>
          <button type="button" onClick={() => handleRemoveUnit(index)}>Remove Unit</button>
        </div>
      ))}

      <button type="button" onClick={handleAddUnit}>Add Unit</button>
      <button type="submit">Save Subject</button>
      <button type="button" className="close-button" onClick={onClose}>Close Form</button> {/* Close button */}
    </form>
  );
};

export default SubjectForm;
