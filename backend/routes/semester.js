import express from 'express';
import Semester from '../models/semester.js'; // Adjust path as needed

const router = express.Router();

// Create a new semester
router.post('/', async (req, res) => {
  const { order, startDate, endDate, department } = req.body;

  try {
    const semester = new Semester({ order, startDate, endDate, department });
    await semester.save();
    res.status(201).send(semester);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all semesters
router.get('/', async (req, res) => {
  try {
    const semesters = await Semester.find();
    res.send(semesters);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
