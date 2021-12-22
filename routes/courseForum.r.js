const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middleware/passport");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");
const CourseForumController = require("../controllers/courseForum.c");
const { model } = require("mongoose");

router
  .route("/CreatePost/:courseId")
  .post(
    validateParam(schemas.idSchema, "courseId"),
    CourseForumController.getForumFromCourse,
    CourseForumController.createPost
  );

router
  .route("/GetForumForCourse/:courseId")
  .get(
    validateParam(schemas.idSchema, "courseId"),
    CourseForumController.getCourseForumByCourse
  );

module.exports = router;
