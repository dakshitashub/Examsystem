import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  department: { type: String, required: true }, // Department like Engineering, Computer Application, etc.
});

const Semester = mongoose.model('Semester', semesterSchema);
export default Semester;
