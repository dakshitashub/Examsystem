import express from 'express';
import Subject from '../models/subject.js'; // Adjust path as needed
import Student from '../models/student.js';

const router = express.Router();

// Create a new subject
router.post('/', async (req, res) => {
  try {
    const subject = new Subject(req.body);
    const semesterId = req.body.semester;
    const departmentName = req.body.department;
    const students = await Student.find({ semester: semesterId, department: departmentName });
    await subject.save();
    for (let student of students) {
      student.subjects.push(subject._id);
      await student.save();
    }
    res.status(201).send(subject);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.send(subjects);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get subjects by semester
router.get('/semester', async (req, res) => {
  try {
    const { semester } = req.query;
    if (!semester) {
      return res.status(400).send({ error: 'Semester ID is required' });
    }

    const subjects = await Subject.find({ semester });
    res.send(subjects);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get subject by code
router.get('/code/:subjectCode', async (req, res) => {
  try {
    const subject = await Subject.findOne({ subjectCode: req.params.subjectCode });
    if (!subject) return res.status(404).send({ error: 'Subject not found' });
    res.send(subject);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a subject by ID
router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const subject = await Subject.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!subject) return res.status(404).send({ error: 'Subject not found' });
    res.send(subject);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a subject by ID
router.delete('/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).send({ error: 'Subject not found' });
    }

    // Find students associated with the deleted subject's semester and department
    const students = await Student.find({ semester: subject.semester, department: subject.department });

    // Remove the subject from each student's subjects array (if needed)
    for (let student of students) {
      const index = student.subjects.indexOf(subject._id);
      if (index !== -1) {
        student.subjects.splice(index, 1);
        await student.save();
      }
    }

    res.send({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).send(error);
  }
});

export default router;
