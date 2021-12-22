const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middleware/passport");
const upload = require("../middleware/upload");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");
const SectionController = require("../controllers/section.c");
const QuizController = require("../controllers/secQuiz.c");
//GET ALL SECTION
router.route("/GetAllSection").get(SectionController.index);

router
  .route("/GetSectionsByCourse/:courseId")
  .get(
    validateParam(schemas.idSchema, "courseId"),
    SectionController.getSectionsByCourse
  );
//CREATE SECTION
router
  .route("/CreateSection")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateBody(schemas.sectionSchema),
    SectionController.addSection
  );
router
  .route("/ModifySection/:sectionID")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    SectionController.getSection,
    SectionController.modifySection
  );
//SESSION
router
  .route("/AddLecture/:sectionID")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    SectionController.getSection,
    SectionController.addLecture
  );
//VIDEO
router
  .route("/AddLectureVideo/:sectionID/:lectureID")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    validateParam(schemas.idSchema, "lectureID"),
    upload.forVid.any("lectureVideo"),
    SectionController.getSection,
    SectionController.getLecture,
    SectionController.addLectureVid
  );
router
  .route("/ModifyLectureVideo/:sectionID/:lectureID")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    validateParam(schemas.idSchema, "lectureID"),
    upload.forVid.any("lectureVideo"),
    SectionController.getSection,
    SectionController.getLecture,
    SectionController.modifyLectureVideo
  );
router
  .route("/DeleteLecture/:sectionID/:lectureID")
  .delete(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    validateParam(schemas.idSchema, "lectureID"),
    SectionController.getSection,
    SectionController.getLecture,
    SectionController.delLecture
  );

router
  .route("/ModifyLectureName/:sectionID/:lectureID")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    validateParam(schemas.idSchema, "lectureID"),
    SectionController.getSection,
    SectionController.getLecture,
    SectionController.modifyLecture
  );
router
  .route("/ActiveSection/:sectionID")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    SectionController.getSection,
    SectionController.activeSection
  );
router
  .route("/DeactivateSection/:sectionID")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    SectionController.getSection,
    SectionController.deactivateSection
  );
router
  .route("/DeleteSection/:sectionID")
  .delete(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    SectionController.getSection,
    SectionController.getCourseBySection,
    SectionController.delSection
  );
//ARTICLES
router
  .route("/AddLectureArticle/:sectionID/:lectureID")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    validateParam(schemas.idSchema, "lectureID"),
    SectionController.getSection,
    SectionController.getLecture,
    SectionController.addLectureArticle
  );

router
  .route("/ModifyLectureArticle/:sectionID/:lectureID")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    validateParam(schemas.idSchema, "lectureID"),
    SectionController.getSection,
    SectionController.getLecture,
    SectionController.modifyLectureArticle
  );
// QUIZ
router
  .route("/AddQuiz/:sectionID")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    SectionController.getSection,
    QuizController.createQuiz
  );

router
  .route("/AddQuizQuestion/:sectionID/:secQuizID")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    validateParam(schemas.idSchema, "secQuizID"),
    SectionController.getSection,
    QuizController.getSecQuiz,
    QuizController.getQuiz,
    QuizController.createQuizQuestion
  );
router
  .route("/ModifyQuizQuestion/:sectionID/:secQuizID")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    validateParam(schemas.idSchema, "secQuizID"),
    SectionController.getSection,
    QuizController.getSecQuiz,
    QuizController.getQuiz,
    QuizController.modifyQuizQuestion
  );
router
  .route("/DeleteQuizQuestion/:sectionID/:secQuizID/:quizQuestId")
  .delete(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    validateParam(schemas.idSchema, "secQuizID"),
    validateParam(schemas.idSchema, "quizQuestId"),
    SectionController.getSection,
    QuizController.getSecQuiz,
    QuizController.getQuiz,
    QuizController.getQuizQuestion,
    QuizController.delQuizQuestion
  );
router
  .route("/DeleteSectionQuiz/:sectionID/:secQuizID")
  .delete(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "sectionID"),
    validateParam(schemas.idSchema, "secQuizID"),
    SectionController.getSection,
    QuizController.getSecQuiz,
    QuizController.getQuiz,
    QuizController.delQuiz
  );
module.exports = router;
