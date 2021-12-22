const router = require("express-promise-router")();
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");
const CourseRevenueController = require("../controllers/revenueCourse.c");
const passport = require("passport");
const passportConfig = require("../middleware/passport");
const { model } = require("mongoose");

router
  .route("/CreateCourseRevenue")
  .post(CourseRevenueController.createRevenueCourse);

router
  .route("/CreateDataForCRevenue/:courseId/:lecId")
  .post(
    validateParam(schemas.idSchema, "courseId"),
    validateParam(schemas.idSchema, "lecId"),
    CourseRevenueController.createDataForCRevenue
  );
router
  .route("/GetCourseRevenueForChart/:courseId/:lecId")
  .get(
    validateParam(schemas.idSchema, "courseId"),
    validateParam(schemas.idSchema, "lecId"),
    CourseRevenueController.getRevenueForChart
  );
router
  .route("/GetAnalysisUserForChart/:courseId/:lecId")
  .get(
    validateParam(schemas.idSchema, "courseId"),
    validateParam(schemas.idSchema, "lecId"),
    CourseRevenueController.getUserForChart
  );

module.exports = router;
