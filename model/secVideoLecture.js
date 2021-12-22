const mongoose = require("mongoose");
const secVideoLectureSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
  },
  minPerVid: { type: Number },
  secPerVid: { type: Number },
});
const SecVideoLecture = mongoose.model(
  "SecVideoLecture",
  secVideoLectureSchema
);
module.exports = SecVideoLecture;
