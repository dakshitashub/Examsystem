// Import necessary modules
import express from 'express';
import multer from 'multer';
import Papa from 'papaparse';
import fs from 'fs';
import Student from '../models/Student.js';
import Score from '../models/Score.js';

// Set up Multer for file upload
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// Route to handle CSV upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path; // Get the uploaded file path
    const csvData = fs.readFileSync(filePath, 'utf8'); // Read the CSV file

    // Parse CSV using PapaParse
    const { data: students } = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    // Iterate through students and save data to DB
    for (let studentData of students) {
      // Find existing student by studentId or create a new one
      let student = await Student.findOne({ studentId: studentData.studentId });
      if (!student) {
        student = new Student({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          studentId: studentData.studentId,
          semester: studentData.semester,
          department: studentData.department,
          // You may need to handle subject assignment logic
        });
        await student.save();
      }

      // Prepare scores for saving
      const scores = studentData.subjects.map((subjectName) => {
        return {
          subject: subjectName, // You may need to convert this to ObjectId if using references
          caScore: parseFloat(studentData.caScore), // Ensure scores are parsed as numbers
          examScore: parseFloat(studentData.examScore),
          totalScore: (0.3 * parseFloat(studentData.caScore)) + (0.7 * parseFloat(studentData.examScore)),
        };
      });

      const score = new Score({
        student: student._id,
        scores: scores,
      });

      await score.save();
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath); // Delete the file after processing

    res.status(200).json({ message: 'CSV data uploaded and saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the file' });
  }
});

export default router;
