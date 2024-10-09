import mongoose from "mongoose";

const lecturerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  lecturerId: { type: String, required: true, unique: true },
  role: { type: String, required: true }, 
});

const Lecturer = mongoose.model('Lecturer', lecturerSchema);
export default Lecturer;
