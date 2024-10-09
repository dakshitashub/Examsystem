import { parse } from 'papaparse';
import Score from '../models/Score'; // Ensure this path is correct
import Student from '../models/student'; // Ensure this path is correct

// Function to handle the processing of CSV data
 async function uploadScores(fileBuffer) {
  return new Promise((resolve, reject) => {
    // Parse the CSV file
    const csvData = fileBuffer.toString('utf-8');
    parse(csvData, {
      header: true,
      complete: async (results) => {
        const records = results.data;

        try {
          // Process each record
          for (const record of records) {
            const { studentId, ...subjects } = record;

            // Find the student by ID
            const student = await Student.findOne({ studentId });

            if (!student) {
              console.warn(`Student with ID ${studentId} not found`);
              continue; // Skip this record if student not found
            }

            // Prepare scores data
            const scores = Object.keys(subjects).map((subjectKey) => {
              const [subjectId] = subjectKey.split('_');
              return {
                subject: subjectId,
                caScore: parseFloat(subjects[subjectKey].caScore),
                examScore: parseFloat(subjects[subjectKey].examScore),
                totalScore: parseFloat(subjects[subjectKey].caScore) * 0.3 + parseFloat(subjects[subjectKey].examScore) * 0.7,
              };
            });

            // Create or update the score entry
            await Score.findOneAndUpdate(
              { student: student._id },
              { scores },
              { upsert: true, new: true }
            );
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      },
    });
  });
}
export default uploadScores