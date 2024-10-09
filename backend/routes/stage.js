import express from 'express';
import Stage from '../models/stage.js'; // Adjust path as needed

const router = express.Router();

// Create a new stage
router.post('/', async (req, res) => {
  try {
    const stage = new Stage(req.body);
    await stage.save();
    res.status(201).send(stage);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all stages
router.get('/', async (req, res) => {
  try {
    const stages = await Stage.find();
    res.send(stages);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
