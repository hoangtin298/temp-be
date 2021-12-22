const Sections = require("../model/section");
const SecQuizzes = require("../model/secQuiz");

const getSecQuiz = async (req, res, next) => {
  let section = req.section;
  let { quizId } = req.values.param;
  let secQuiz;
  secQuiz = section.listQuiz.find((e) => e._id.toString() === quizId);
  if (!secQuiz) {
    throw new Error("Quiz not found in this section");
  } else {
    secQuiz = req.secQuiz;
    next();
  }
};

const getQuiz = async (req, res, next) => {
  let secQuiz = req.secQuiz;
  let quiz;
  quiz = await SecQuizzes.findById(secQuiz.contentQuiz);
  if (!quiz) {
    throw new Error("Quiz not found");
  } else {
    quiz = req.quiz;
    next();
  }
};
const getQuizQuestion = async (req, res, next) => {
  let quiz = req.quiz;
  let { quizQuestId } = req.values.param;
  let quizQuest = await quiz.quizProblemList.find(
    (prob) => prob._id.toString() === quizQuestId
  );
  if (!quizQuest) {
    throw new Error("Quiz problem not found");
  } else {
    quizQuest = req.quizQuest;
    next();
  }
};

const createQuiz = async (req, res, next) => {
  let section = req.section;
  let quizName = req.body.quizName;
  section.listQuiz.push({ quizName });
  await section.save();
  res.status(201).json({ message: "Quiz added" });
};

const createQuizQuestion = async (req, res, next) => {
  let { question, choiceArr, explainArr, answer } = req.body;
  let quiz = req.quiz;
  quiz.quizProblemList.push({
    quizQuestion: question,
    quizQuestions: choiceArr,
    quizExplain: explainArr,
    quizAnswers: answer,
  });
  await quiz.save();
  res.status(201).json({ message: "New question added" });
};

const modifyQuizQuestion = async (req, res, next) => {
  let { question, choiceArr, explainArr, answer } = req.body;
  let quiz = req.quiz;
  let quizProblem = req.quizProblem;
  quizProblem.quizQuestion = question;
  quizProblem.quizChoices = choiceArr;
  quizProblem.quizExplain = explainArr;
  quizProblem.quizAnswers = answer;
  await quiz.save();
  res.status(201).json({ message: "Quiz updated" });
};

const delQuizQuestion = async (req, res, next) => {
  let quiz = req.quiz;
  let quizQuest = req.quizQuest;
  quiz.listQuiz.filter((e) => e._id.toString() !== quizQuest._id.toString());
  await quiz.save();
  res.status(201).json({ message: "Quiz problem" });
};

const delQuiz = async (req, res, next) => {
  let quiz = req.quiz;
  let section = req.section;
  await quiz.remove();
  section.listQuiz.filter((e) => e._id.toString() !== quiz._id.toString());
  await section.save();
  res.status(201).json({ message: "Quiz deleted" });
};
module.exports = {
  getSecQuiz,
  getQuiz,
  getQuizQuestion,
  createQuiz,
  createQuizQuestion,
  delQuizQuestion,
  delQuiz,
  modifyQuizQuestion,
};
