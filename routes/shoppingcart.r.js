const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middleware/passport");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routerHelpers");
const CartController = require("../controllers/shoppingcart.c");
//ADDTOCART
router
  .route("/AddToCart/:userID/:courseID")
  .post(
    validateParam(schemas.idSchema, "userID"),
    validateParam(schemas.idSchema, "courseID"),
    CartController.checkExistCart,
    CartController.checkExistItem,
    CartController.addToCart
  );
//Add to wishlist
router
  .route("/AddToWishlist/:userID/:courseID")
  .post(
    validateParam(schemas.idSchema, "userID"),
    validateParam(schemas.idSchema, "courseID"),
    CartController.checkExistCart,
    CartController.checkExistWLItem,
    CartController.addToWishlist
  );
//GETCARTBYUSERID
router
  .route("/GetCartByUser/:userID")
  .get(
    validateParam(schemas.idSchema, "userID"),
    CartController.getCartByUserId
  );
router
  .route("/GetWishlistByUser/:userID")
  .get(
    validateParam(schemas.idSchema, "userID"),
    CartController.getWishByUserId
  );

//REMOVEITEMINCART
router
  .route("/RemoveItemInCart/:cartID/:itemID")
  .delete(
    validateParam(schemas.idSchema, "cartID"),
    validateParam(schemas.idSchema, "itemID"),
    CartController.getOneCart,
    CartController.removeCartItem
  );
router
  .route("/RemoveItemInWishlist/:cartID/:itemID")
  .delete(
    validateParam(schemas.idSchema, "cartID"),
    validateParam(schemas.idSchema, "itemID"),
    CartController.getOneCart,
    CartController.removeWishlistItem
  );

//MOVE TO CART/WISHLIST
router
  .route("/MoveToCart/:cartID/:itemID")
  .put(
    validateParam(schemas.idSchema, "cartID"),
    validateParam(schemas.idSchema, "itemID"),
    CartController.getOneCart,
    CartController.moveToCart
  );
router
  .route("/MoveToWishlist/:cartID/:itemID")
  .put(
    validateParam(schemas.idSchema, "cartID"),
    validateParam(schemas.idSchema, "itemID"),
    CartController.getOneCart,
    CartController.moveToWishlist
  );
router.route("/test").get(CartController.index);
module.exports = router;
