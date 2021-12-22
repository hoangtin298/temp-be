const mongoose = require("mongoose");
const sectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
  },
  listLecture: [
    {
      lectureName: { type: String },
      lectureType: { type: String },
      contentVideo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SecVideoLecture",
      },
      contentArticle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SecArticles",
      },
    },
  ],
  listQuiz: [
    {
      quizName: { type: String },
      contentQuiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SecQuizzes",
      },
    },
  ],
  publishStatus: {
    type: Boolean,
    default: false,
  },
  countSection: {
    video: { type: Number, default: 0 },
    article: { type: Number, default: 0 },
    practices: { type: Number, default: 0 },
  },
  fromCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
});
const Sections = mongoose.model("Sections", sectionSchema);
module.exports = Sections;
