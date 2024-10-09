import React, { useState } from 'react';
import SemesterList from './SemesterList.jsx';
import StudentMarksEntry from './StudentMarksEntry.jsx';
import ResultsView from './ResultsView.jsx'; // Component to view results
// import './MarksEntryPage.css';

const MarksEntryPage = () => {
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const handleSelectSemester = (semesterId, action) => {
    setSelectedSemester(semesterId);
    setSelectedAction(action);
  };

  return (
    <div className="marks-entry-page">
      {!selectedSemester ? (
        <SemesterList onSelectSemester={handleSelectSemester} />
      ) : selectedAction === 'addMarks' ? (
        <StudentMarksEntry semesterId={selectedSemester} />
      ) : selectedAction === 'viewResults' ? (
        <ResultsView semesterId={selectedSemester} />
      ) : null}
    </div>
  );
};

export default MarksEntryPage;
