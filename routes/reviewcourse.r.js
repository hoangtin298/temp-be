const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middleware/passport");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");
const ReviewCourseController = require("../controllers/reviewcourse.c");
router
  .route("/GetCourseReview/:courseId")
  .get(
    validateParam(schemas.idSchema, "courseId"),
    ReviewCourseController.getReviewByCourse
  );
router
  .route("/GetAnalysisReview/:courseId")
  .get(
    validateParam(schemas.idSchema, "courseId"),
    ReviewCourseController.getAnalysisReviewByCourse
  );
router
  .route("/Review/:courseId")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "courseId"),
    ReviewCourseController.getReviewForReq,
    ReviewCourseController.reviewCourse
  );
router
  .route("/ReplyReview/:reviewcourseId/:reviewId")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "reviewcourseId"),
    validateParam(schemas.idSchema, "reviewId"),
    ReviewCourseController.getReviewById,
    ReviewCourseController.getReviewOfStudent,
    ReviewCourseController.replyReview
  );
module.exports = router;
