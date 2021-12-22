const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middleware/passport");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");
const CategoryController = require("../controllers/category.c");

router
  .route("/CreateCategory")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateBody(schemas.categorySchema),
    CategoryController.createCate
  );

router
  .route("/CreateSubCategory/:cateId")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "cateId"),
    CategoryController.createSubCate
  );

router.route("/GetCategories").get(CategoryController.getAllCate);

router.route("/GetAllSubCategories").get(CategoryController.getAllSubCate);
router
  .route("/GetSubCategoryList/:cateId")
  .get(
    validateParam(schemas.idSchema, "cateId"),
    CategoryController.getSubCategory
  );

router.route("/DeleteCategory/:cateId").delete(
  // passport.authenticate("jwt", { session: false }),
  validateParam(schemas.idSchema, "cateId"),
  CategoryController.deleteCate
);

router
  .route("/DeleteSubCategory/:cateId/:subCateId")
  .delete(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "cateId"),
    validateParam(schemas.idSchema, "subCateId"),
    CategoryController.deleteSubCate
  );

router
  .route("/UpdateCategory/:cateId")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "cateId"),
    CategoryController.modifyCategory
  );

router
  .route("/UpdateSubCategory/:cateId/:subCateId")
  .put(
    passport.authenticate("jwt", { session: false }),
    validateParam(schemas.idSchema, "cateId"),
    validateParam(schemas.idSchema, "subCateId"),
    CategoryController.modifySubCategory
  );
router
  .route("/GetCourseBySubCategoryList/:anyCateId")
  .get(
    validateParam(schemas.idSchema, "anyCateId"),
    CategoryController.getCoursesByCate
  );
module.exports = router;
