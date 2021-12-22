const router = require("express-promise-router")();
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");
const OnlineLearningController = require("../controllers/onlineLearning.c");
const passport = require("passport");
const passportConfig = require("../middleware/passport");

router
  .route("/GetPayedCourseListByUser/:userId")
  .get(
    validateParam(schemas.idSchema, "userId"),
    OnlineLearningController.getPayedCoursesForStu
  );

router
  .route("/GetStudyContent/:courseId")
  .get(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "courseId"),
    OnlineLearningController.getCourseStudyContent
  );

module.exports = router;
