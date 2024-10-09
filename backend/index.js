import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';
import studentRoutes from "./routes/student.js";
import lecturerRoutes from './routes/lecturer.js';
import userRoutes from './routes/user.js'
import subjectRoutes from './routes/subject.js';
import semesterRoutes from './routes/semester.js';
import stageRoutes from './routes/stage.js';
import uploadRoutes from './routes/upload.js'
import scoreRoutes from './routes/score.js';
dotenv.config();
const port = process.env.PORT || 3001;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors()); 
app.use(bodyParser.json());
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));
  app.use('/api/students', studentRoutes);
  app.use('/api/lecturers', lecturerRoutes);
  app.use('/api/login', userRoutes);
  app.use('/api/subjects', subjectRoutes);
  app.use('/api/semesters', semesterRoutes);
  app.use('/api/stages', stageRoutes);
  app.use('/api/scores', scoreRoutes);
  app.use('/api', uploadRoutes); // Route for file upload
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
