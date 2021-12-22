const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middleware/passport");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");
const OnlineTeachingController = require("../controllers/onlineteaching.c");

router
  .route("/GetStudentPerCourse/:courseId")
  .get(
    validateParam(schemas.idSchema, "courseId"),
    OnlineTeachingController.getStudentPerCourse
  );
router
  .route("/GetTotalAllCourse/:lecId")
  .get(
    validateParam(schemas.idSchema, "lecId"),
    OnlineTeachingController.getTotalStudentAllCourse
  );
router
  .route("/test/:courseId")
  .post(
    validateParam(schemas.idSchema, "courseId"),
    OnlineTeachingController.testAddStuToCourse
  );

router.route("/AddPaymentForCourse/:courseId").put(
  // passport.authenticate("jwt", { session: false }),
  validateParam(schemas.idSchema, "courseId"),
  OnlineTeachingController.addPaymentMethodForCourse
);
module.exports = router;
