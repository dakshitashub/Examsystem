import express from 'express';
import multer from 'multer';
import path from 'path';
import Student from '../models/student.js';
import Subject from '../models/subject.js';
import Semester from '../models/semester.js';

const router = express.Router();
// Create a new student
// router.post('/', async (req, res) => {
//   try {
//     const { firstName, lastName, studentId, semester,department } = req.body;

//     // Optional: Fetch subjects based on semester and department if needed
//     const subjects = await Subject.find({ semester });
//     const subjectIds = subjects.map(subject => subject._id);

//     const student = new Student({ firstName, lastName, studentId, semester, subjects ,department});
//     await student.save();
//     res.status(201).send(student);
//   } catch (error) {
//     console.error('Error creating student:', error);
//     res.status(400).send({ error: 'Failed to create student', details: error.message });
//   }
// });


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded photos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save with a unique filename
  },
});
const upload = multer({ storage });

// Create a new student with a photo upload
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { firstName, lastName, studentId, semester, department } = req.body;
    const photo = req.file ? req.file.path : null; // Save the file path

    // Fetch subjects based on semester and department
    const subjects = await Subject.find({ semester });
    const subjectIds = subjects.map(subject => subject._id);

    const student = new Student({ firstName, lastName, studentId, semester, department, subjects, photo });
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(400).send({ error: 'Failed to create student', details: error.message });
  }
});



// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find()
      .populate('stage')
      .populate('semester') // Only if semester is a reference
      .populate('subjects'); // Only if subjects are directly referenced

    res.send(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send({ error: 'Failed to fetch students', details: error.message });
  }
});

router.get('/semester/:semesterOrder', async (req, res) => {
  try {
    const { semesterOrder } = req.params;

    // Find the Semester document by the order field
    const semester = await Semester.findOne({ order: semesterOrder });

    if (!semester) {
      return res.status(404).send({ error: 'Semester not found' });
    }

    // Find students by the semester order
    const students = await Student.find({ semester: semesterOrder })
                                  .populate('subjects'); // populate subjects if needed

    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});



export default router;
