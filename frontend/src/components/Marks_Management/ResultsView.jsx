import { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import jsPDF from 'jspdf';  // Import jsPDF for PDF generation
import 'jspdf-autotable';   // AutoTable plugin for table generation in PDF
import './ResultsView.css';

const ResultsView = ({ semesterId }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [semesterName, setSemesterName] = useState('');
  const [consolidatedReport, setConsolidatedReport] = useState([]);

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

    const fetchSemester = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/semesters/${semesterId}`);
        const data = await response.json();
        setSemesterName(`${data.order} ${data.department}`);
      } catch (error) {
        console.error('Error fetching semester details:', error);
      }
    };

    fetchStudents();
    fetchSemester();
  }, [semesterId]);

  const fetchStudentResults = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/scores/student/${studentId}?semester=${semesterId}`);
      const data = await response.json();
      if (data.error) {
        console.error(data.error);
        return [];
      } else {
        // Flatten the scores array if it's nested
        return data.map(item => item.scores).flat();
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      return [];
    }
  };

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
  
    try {
      const studentResults = await fetchStudentResults(student._id);
      const flattenedScores = studentResults;
      setResults(flattenedScores);
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]);
    }
  };

  const calculatePercentage = (totalScore) => {
    const maxScore = 100;
    return isNaN(totalScore) ? 'N/A' : ((totalScore / maxScore) * 100).toFixed(2);
  };

  const calculateFinalPercentage = () => {
    if (results.length === 0) return '0.00';
    const totalSum = results.reduce((sum, score) => sum + (isNaN(score.totalScore) ? 0 : score.totalScore), 0);
    return ((totalSum / (results.length * 100)) * 100).toFixed(2);
  };

  const renderPassFailStatus = () => {
    const finalPercentage = parseFloat(calculateFinalPercentage());
    return finalPercentage >= 35 ? 'Pass' : 'Fail';
  };
  const convertImageToBase64 = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // Handle CORS if needed
      img.src = imageUrl;
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
  
        const dataURL = canvas.toDataURL('image/png'); // Convert image to base64
        resolve(dataURL);
      };
  
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        reject(error);
      };
    });
  };
  
  const downloadPDF = async () => {
    const doc = new jsPDF();
    console.log(selectedStudent);
    
    // Construct the correct image URL
    const imagePath = `http://localhost:3000/backend/${selectedStudent.photo}`; // Adjust port and domain as necessary
    console.log(imagePath);
    
    try {
      const imageBase64 = await convertImageToBase64(imagePath);
      
      // Add the student's image to the PDF if imageBase64 is valid
      if (imageBase64) {
        // Add image to the PDF at position x=15, y=40, and size 180x160
        doc.addImage(imageBase64, 'PNG', 170, 20, 30, 30); // Adjust dimensions as needed
      } else {
        console.error('Failed to load image data.');
      }
  
      // Add title and student details
      doc.text(`Results for ${selectedStudent.firstName}`, 10, 10);
      doc.text(`Semester: ${semesterName}`, 10, 20);
      doc.text(`Student ID: ${selectedStudent.studentId}`, 10, 30);
      doc.text(`Final Percentage: ${calculateFinalPercentage()}%`, 10, 40);
      doc.text(`Status: ${renderPassFailStatus()}`, 10, 50);
  
      // Add results table
      const tableColumnHeaders = ["Subject", "Subject Code", "CA Score", "Exam Score", "Total Score", "Percentage"];
      const tableRows = results.map(score => [
        score.subject.name,
        score.subject.subjectCode,
        score.caScore ?? 'N/A',
        score.examScore ?? 'N/A',
        score.totalScore ?? 'N/A',
        calculatePercentage(score.totalScore)
      ]);
  
      doc.autoTable({
        head: [tableColumnHeaders],
        body: tableRows,
        startY: 60,  // Start the table below the details
      });
  
      // Add final percentage and pass/fail status at the bottom
      doc.text(`Final Percentage: ${calculateFinalPercentage()}%`, 10, doc.autoTable.previous.finalY + 20);
      doc.text(`Status: ${renderPassFailStatus()}`, 10, doc.autoTable.previous.finalY + 30);
  
      // Save the PDF
      doc.save(`${selectedStudent.firstName}_Results.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  

  const generateAllStudentReport = async () => {
    const studentReports = [];

    for (const student of students) {
      const studentResults = await fetchStudentResults(student._id);

      const caScores = studentResults.map(score => score.caScore ?? 0);
      const examScores = studentResults.map(score => score.examScore ?? 0);

      const avgCaScore = (caScores.reduce((sum, score) => sum + score, 0) / caScores.length) || 0;
      const avgExamScore = (examScores.reduce((sum, score) => sum + score, 0) / examScores.length) || 0;

      studentReports.push({
        name: `${student.firstName} ${student.lastName}`,
        avgCaScore: avgCaScore.toFixed(2),
        avgExamScore: avgExamScore.toFixed(2),
      });
    }

    setConsolidatedReport(studentReports);  // Set the report data to state
  };

  const generatePDF = (reports) => {
    const doc = new jsPDF();

    // Add title
    doc.text('Consolidated Student Report', 10, 10);

    // Add table
    const tableColumnHeaders = ["Student Name", "Avg CA Score (Out of 30)", "Avg Exam Score (Out of 70)"];
    const tableRows = reports.map(report => [
      report.name,
      report.avgCaScore,
      report.avgExamScore,
    ]);

    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 20,
    });

    // Save the PDF
    doc.save('All_Students_Report.pdf');
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Subject',
        accessor: 'subject.name',
      },
      {
        Header: 'Subject Code',
        accessor: 'subject.subjectCode',
      },
      {
        Header: 'CA Score',
        accessor: 'caScore',
        Cell: ({ cell: { value } }) => (isNaN(value) ? 'N/A' : value),
      },
      {
        Header: 'Exam Score',
        accessor: 'examScore',
        Cell: ({ cell: { value } }) => (isNaN(value) ? 'N/A' : value),
      },
      {
        Header: 'Total Score',
        accessor: 'totalScore',
        Cell: ({ cell: { value } }) => (isNaN(value) ? 'N/A' : value),
      },
      {
        Header: 'Percentage',
        Cell: ({ row }) => (
          <span>{calculatePercentage(row.original.totalScore)}%</span>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => results, [results]);

  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div>
      <h2>Results View</h2>

      <button onClick={generateAllStudentReport} className="download-btn">Generate Consolidated Report</button>

      {consolidatedReport.length > 0 && (
        <div>
          <h3>Consolidated Student Report</h3>
          <table className="consolidated-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Avg CA Score (Out of 30)</th>
                <th>Avg Exam Score (Out of 70)</th>
              </tr>
            </thead>
            <tbody>
              {consolidatedReport.map((report, index) => (
                <tr key={index}>
                  <td>{report.name}</td>
                  <td>{report.avgCaScore}</td>
                  <td>{report.avgExamScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => generatePDF(consolidatedReport)} className="download-btn">Download Consolidated Report PDF</button>
        </div>
      )}

      {selectedStudent && (
        <div className="student-details">
          <p><strong>Student Name:</strong> {selectedStudent.firstName}</p>
          <p><strong>Semester:</strong> {semesterName}</p>
          <p><strong>Student ID:</strong> {selectedStudent.studentId}</p>
        </div>
      )}

      {students.length > 0 && (
        <div>
          <h3>Select a student:</h3>
          <ul>
            {students.map(student => (
              <li key={student._id}>
                <button onClick={() => handleStudentSelect(student)}>
                  {student.firstName} {student.lastName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length > 0 ? (
        <div>
          <h3>Student Results</h3>
          <table {...getTableProps()} className="results-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} style={{ textAlign: 'right' }}>
                  <strong>Status:</strong>
                </td>
                <td>{renderPassFailStatus()}</td>
              </tr>
            </tfoot>
          </table>

          <button onClick={downloadPDF} className="download-btn">Download Results PDF</button>
        </div>
      ) : (
        <p>No results available. Please select a student.</p>
      )}
    </div>
  );
};

export default ResultsView;
