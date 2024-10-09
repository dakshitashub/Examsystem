import express from 'express';
// import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// Login route
router.get('/', async (req, res) => {
  const token = req.header('auth-token')
  
  if (!token) return res.status(401).send({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, 'DHRUV');
    const user = await User.findById(decoded.id);
    
    if (!user) return res.status(404).send({ error: 'User not found' });
    
    res.send({ name: user.name, role: user.role });
  } catch (error) {
    res.status(401).send({ error: 'Invalid token' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, password } = req.body;

    // Find the user by name
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }
    
    if (user.password!=password) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, 'DHRUV', { expiresIn: '1h' });

    res.send({ token ,user});
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
