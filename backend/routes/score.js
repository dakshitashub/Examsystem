import express from 'express';
import Score from '../models/score.js';

const router = express.Router();

router.get('/student/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { semester } = req.query;

  try {
    // Fetch the student's scores from the Score collection
    const studentScores = await Score.find({ student: studentId }).populate({
      path: 'scores.subject',
      match: { semester }, // Filter subjects by semester
      select: 'name subjectCode', // Only return the subject's name and code
    });

    if (!studentScores) {
      return res.status(404).send({ error: 'No scores found for the student in this semester' });
    }

    res.send(studentScores);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching student results' });
  }
});

router.post('/student/:studentId', async (req, res) => {
  try {
    const { subjectId, caScore, examScore, totalScore } = req.body;
    const { studentId } = req.params;

    // Find the score document for the student
    const score = await Score.findOne({ student: studentId });

    if (score) {
      // Update existing score entry if it exists
      const subjectScoreIndex = score.scores.findIndex(s => s.subject.toString() === subjectId);

      if (subjectScoreIndex !== -1) {
        score.scores[subjectScoreIndex] = {
          subject: subjectId,
          caScore,
          examScore,
          totalScore
        };
      } else {
        // If the subject score doesn't exist, add a new entry
        score.scores.push({
          subject: subjectId,
          caScore,
          examScore,
          totalScore
        });
      }

      await score.save();
      res.status(200).send(score);
    } else {
      // Create a new score document if none exists for the student
      const newScore = new Score({
        student: studentId,
        scores: [{
          subject: subjectId,
          caScore,
          examScore,
          totalScore
        }]
      });

      await newScore.save();
      res.status(201).send(newScore);
    }
  } catch (error) {
    console.error('Error adding or updating CA score:', error);
    res.status(400).send({ error: 'Failed to add or update CA score' });
  }
});

// Create a new score entry (usually not needed since we handle creation in the above endpoint)
router.post('/', async (req, res) => {
  try {
    const score = new Score(req.body);
    await score.save();
    res.status(201).send(score);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all scores
router.get('/', async (req, res) => {
  try {
    const scores = await Score.find().populate('student').populate('subject'); // Adjust as needed
    res.send(scores);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
