const router = require("express-promise-router")();
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");
const UserController = require("../controllers/user.c");
const passport = require("passport");
const passportConfig = require("../middleware/passport");
const upload = require("../middleware/upload");

//APPROVAL ACCOUNT
router.route("/GetUserUnderApproval").get(UserController.getUserUnderApproval);
router
  .route("/Approve/:userID")
  .put(
    validateParam(schemas.idSchema, "userID"),
    UserController.getUser,
    UserController.approveUserToLec
  );
router.route("/GetUserUnderApproval").get(UserController.getUserUnderApproval);
router
  .route("/ActiveUser/:userID")
  .put(
    validateParam(schemas.idSchema, "userID"),
    UserController.getUser,
    UserController.activeUser
  );
router
  .route("/Deactivate/:userID")
  .put(
    validateParam(schemas.idSchema, "userID"),
    UserController.getUser,
    UserController.deActivateUser
  );
//UPLOAD IMAGES
router
  .route("/Me/Avatar")
  .post(
    passport.authenticate("jwt", { session: false }),
    upload.forImg.single("avatar"),
    UserController.uploadAvatar
  );

router
  .route("/OnlineTeaching/VerifyImages/:userID")
  .post(
    validateParam(schemas.idSchema, "userID"),
    UserController.getUser,
    upload.forImg.array("verifyImages", 2),
    UserController.uploadVerifyImages
  );

//Create with auths
router
  .route("/CreateUser")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateBody(schemas.userSchema),
    UserController.register
  );

//Delete
router
  .route("/DeleteUser/:userID")
  .delete(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "userID"),
    UserController.getUser,
    UserController.deleteUser
  );
//GET USER
router.route("/GetUserList").get(UserController.index);
router.route("/GetUserPaginatedList").get(UserController.getUserAllOrKeyword);
router.route("/GetLecturerActive").get(UserController.getLecturerActive);
//UPDATE
router
  .route("/UpdateUser/:userID")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "userID"),
    validateBody(schemas.userOptionalSchema),
    UserController.replaceUser
  )
  .patch(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "userID"),
    validateBody(schemas.userOptionalSchema),
    UserController.replaceUser
  );
//API HANDLE PW
router
  .route("/ChangePassword")
  .put(
    passport.authenticate("jwt", { session: false }),
    UserController.changePwUser
  );
router.route("/GetCodeByEmail").post(UserController.getCodeByEmail);
router.route("/ForgetPassword").put(UserController.forgetPassword);
//GET BY ID
router
  .route("/GetUserByID/:userID")
  .get(
    validateParam(schemas.idSchema, "userID"),
    UserController.getUser,
    UserController.getUserByID
  );
//AUTHENTICATion
router.route("/SignIn").post(
  // validateBody(schemas.loginRequire),
  passport.authenticate("local", { session: false }),
  UserController.login
);
router
  .route("/SignUpForTeaching")
  .post(
    validateBody(schemas.onlineTeachingSchema),
    UserController.registerForTeaching
  );
router
  .route("/SignUp")
  .post(validateBody(schemas.userSchema), UserController.register);

router
  .route("/auth/google")
  .post(
    passport.authenticate("google-token", { session: false }),
    UserController.loginGoogle
  );
router
  .route("/auth/facebook")
  .post(
    passport.authenticate("facebook-token", { session: false }),
    UserController.loginFacebook
  );

//REQUEST FOR TEACHING
router
  .route("/RequestForOnlineTeaching/:userID")
  .post(
    validateParam(schemas.idSchema, "userID"),
    UserController.getUser,
    UserController.requestForTeaching
  );
router.route("/verify/:uniqueString").get(UserController.afterConfirmation);
router.route("/SendMailInform").put(UserController.sendMailInform);
router.route("/auth/error").get((req, res) => res.send("Unknown Error"));
module.exports = router;
