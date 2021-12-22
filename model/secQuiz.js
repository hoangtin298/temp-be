const mongoose = require("mongoose");
const secQuizzesSchema = new mongoose.Schema({
  quizProblemList: [
    {
      quizQuestion: { type: String },
      quizChoices: [String],
      quizExplain: [String],
      quizAnswers: { type: Number },
    },
  ],
});
const SecQuizzes = mongoose.model("SecQuizzes", secQuizzesSchema);
module.exports = SecQuizzes;
