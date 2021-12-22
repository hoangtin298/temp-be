const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middleware/passport");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");

const CoursePromotionController = require("../controllers/coursepromotion.c");

router.route("/GetAllCP").get(CoursePromotionController.index);

router
  .route("/CreatePromotionForCourse/:courseId")
  .post(
    validateParam(schemas.idSchema, "courseId"),
    CoursePromotionController.getPromotionByCourse,
    CoursePromotionController.saveCoursePromotion
  );

module.exports = router;
