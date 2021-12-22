const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middleware/passport");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");
const WatchingHistoryController = require("../controllers/watchingHistory.c");
router
  .route("/SaveWatchingHistory/:userId")
  .put(
    validateParam(schemas.idSchema, "userId"),
    WatchingHistoryController.getOneWatchingHistory,
    WatchingHistoryController.saveWatchingHistory
  );

router
  .route("/GetWatchingHistory")
  .get(WatchingHistoryController.getWatchingHistory);

module.exports = router;
