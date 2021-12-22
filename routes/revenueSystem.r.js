const router = require("express-promise-router")();
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");
const RevenueSystemController = require("../controllers/revenueSystem.c");
const passport = require("passport");
const passportConfig = require("../middleware/passport");
const { model } = require("mongoose");

router
  .route("/CreateRevenueSystem")
  .post(RevenueSystemController.createRevenueSystem);

router.route("/GetRevenueSystem").get(
  // passport.authenticate("jwt", { session: false }),
  // RevenueSystemController.checkAdmin,
  RevenueSystemController.getRevenueForChart
);

router.route("/GetAnalysisUser").get(
  // passport.authenticate("jwt", { session: false }),
  // RevenueSystemController.checkAdmin,
  RevenueSystemController.getAnalysisUser
);
router
  .route("/GetAnalysisCourse")
  .get(
    passport.authenticate("jwt", { session: false }),
    RevenueSystemController.checkAdmin,
    RevenueSystemController.getAnalysisCourse
  );
router.route("/GetRevenueAllTime").get(RevenueSystemController.getTotalRevenue);
router
  .route("/GetTopRatedCourse")
  .get(RevenueSystemController.getCourseByReviewScore);
module.exports = router;
