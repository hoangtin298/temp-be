const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middleware/passport");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");
const CourseController = require("../controllers/course.c");
const upload = require("../middleware/upload");

//GET_ALL
router.route("/GetAllCourse").get(CourseController.index);
router
  .route("/GetCourseDetail/:courseID")
  .get(
    validateParam(schemas.idSchema, "courseID"),
    CourseController.getCourseDetail
  );
//PUBLISH COURSE
router.route("/PublishCourse/:courseID").put(
  // passport.authenticate("jwt", { session: false }),
  validateParam(schemas.idSchema, "courseID"),
  CourseController.getOneCourse,
  CourseController.publishCourse
);
//ADD_COURSE
router
  .route("/CreateCourse")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateBody(schemas.courseInitSchema),
    CourseController.createCourse
  );
router
  .route("/AddThumbNail/:courseID")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "courseID"),
    upload.forImg.single("thumbnail"),
    CourseController.getOneCourse,
    CourseController.addCourseThumbnail
  );
router
  .route("/AddPreviewVid/:courseID")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "courseID"),
    upload.forVid.any("previewVid"),
    CourseController.getOneCourse,
    CourseController.addCoursePreviewVid
  );
//DELETE_COURSE
router
  .route("/DeactivateCourse/:courseID")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "courseID"),
    CourseController.getOneCourse,
    CourseController.deactivateCourse
  );
//UPDATE_COURSE;
router
  .route("/UpdateCourseGeneralInfo/:courseID")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "courseID"),
    CourseController.getOneCourse,
    CourseController.updateCourseInfo
  )
  .patch(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "courseID"),
    CourseController.getOneCourse,
    CourseController.updateCourseInfo
  );
router
  .route("/UpdateCoursePricing/:courseID")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "courseID"),
    CourseController.getOneCourse,
    CourseController.updateCoursePricing
  );

//GOAL
router
  .route("/AddCourseGoal/:courseID")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "courseID"),
    CourseController.getOneCourse,
    CourseController.addCourseGoals
  );

//REQUIREMENT
router
  .route("/AddCourseRequirement/:courseID")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "courseID"),
    CourseController.getOneCourse,
    CourseController.addCourseRequirements
  );
//SEARCH
router.route("/GetPaginatedCourse").get(CourseController.getCourseByKeyWord);
router
  .route("/GetCourseUnderApproval")
  .get(CourseController.getCourseUnderApproval);

router
  .route("/GetCourseByLecturer/:lecId")
  .get(
    validateParam(schemas.idSchema, "lecId"),
    CourseController.getCourseByLecturer
  );
//ADD CO CREATOR
router
  .route("/AddCoCreator")
  .put(
    passport.authenticate("jwt", { session: false }),
    CourseController.addCoCreator
  );

router
  .route("/SubmitCourseToReview/:courseID")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "courseID"),
    CourseController.getOneCourse,
    CourseController.submitCourseToReview
  );
router
  .route("/DeleteCourse/:courseID")
  .delete(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "courseID"),
    CourseController.getOneCourse,
    CourseController.deleteCourse
  );
module.exports = router;
