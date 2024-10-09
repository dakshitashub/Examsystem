import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjectCode: { type: String, required: true, unique: true },
  semester: { type: Number, required: true },
  department: { type: String, required: true }, // Department like Engineering, Computer Application, etc.
  units: [unitSchema],
});

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
