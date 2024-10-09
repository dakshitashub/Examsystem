import express from 'express';
import Lecturer from '../models/lecturer.js'; // Adjust path as needed
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/', async (req, res) => {
  const { firstName, lastName, lecturerId, role } = req.body;

  // Validate role
  const validRoles = ['Academic Coordinator', 'Instructor'];
  if (!validRoles.includes(role)) {
    return res.status(400).send('Invalid role');
  }

  try {
    const user = new User({name:`${firstName+" "+lastName}`,role:"Lecturer",password:lecturerId});
    await user.save();
    const lecturer = new Lecturer({ firstName, lastName, lecturerId, role });
    await lecturer.save();
    res.status(201).send(lecturer);
  } catch (error) {
    res.status(402).send(error);
  }
});

// Get all lecturers
router.get('/get-all', async (req, res) => {
  try {
    const lecturers = await Lecturer.find();
    res.send(lecturers);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get('/', async (req, res) => {
  try {
    const token = req.header('auth-token')
    if (!token) return res.status(401).send({ error: 'No token provided' });
    const decoded = jwt.verify(token, 'DHRUV');
    // console.log(token,decoded)

    const user = await User.findById(decoded.id);
    const lecturer = await Lecturer.findOne({lecturerId:user.password});
    if (!lecturer) {
      return res.status(404).send('Lecturer not found');
    }
    res.send(lecturer);
  } catch (error) {
    res.status(500).send(error);
  }
});


export default router;
