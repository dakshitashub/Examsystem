import mongoose, { mongo } from "mongoose";
const stageSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// module.exports = mongoose.model('Stage', stageSchema);
const Stage = mongoose.model('Stage',stageSchema)
export default Stage