const router = require("express-promise-router")();
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");
const SubCourseController = require("../controllers/subcribecourse.c");
const passport = require("passport");
const passportConfig = require("../middleware/passport");

router
  .route("/Payment")
  .post(
    passport.authenticate("jwt", { session: false }),
    SubCourseController.renderPayload,
    SubCourseController.payment
  );

router
  .route("/success")
  .get(
    SubCourseController.paymentsuccess,
    SubCourseController.getOrder,
    SubCourseController.handleAfterPayment
  );

// router.route("/test").get(SubCourseController.renderPayload);
// router.route("/Payment").post(SubCourseController.stripeTest);
router.route("/GetOrder").get(SubCourseController.getOrder);
module.exports = router;
