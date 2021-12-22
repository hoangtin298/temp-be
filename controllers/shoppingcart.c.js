const Carts = require("../model/shoppingcart");
const Courses = require("../model/course");
//SUB
const getOneCart = async (req, res, next) => {
  let cart;
  let { cartID } = req.value.params;
  cart = await Carts.findById(cartID);
  if (cart == null) {
    return res.status(500).json({ message: "Cart not found" });
  }
  req.cart = cart;
  next();
};
const checkExistCart = async (req, res, next) => {
  let { userID } = req.value.params;
  let checkCart = await Carts.findOne({ buyer: userID });
  if (checkCart) {
    req.checkCart = checkCart;
    next();
  } else {
    req.checkCart = null;
    next();
  }
};
const checkExistItem = async (req, res, next) => {
  let { courseID } = req.value.params;
  let cart = req.checkCart;
  let checkInWLItem = false;
  if (cart !== null) {
    let index = await cart.listItem.findIndex(
      (item) => item.toString() === courseID
    );
    let index2 = await cart.wishlist.findIndex(
      (item) => item.toString() === courseID
    );
    if (index !== -1) {
      return res.json({ message: "Already in cart" });
    } else if (index === -1 && index2 !== -1) {
      checkInWLItem = true;
      req.checkInWLItem = checkInWLItem;
      next();
    } else next();
  } else next();
};
const checkExistWLItem = async (req, res, next) => {
  let { courseID } = req.value.params;
  let cart = req.checkCart;
  let checkInCartItem = false;
  if (cart !== null) {
    let index = await cart.wishlist.findIndex(
      (item) => item.toString() === courseID
    );
    let index2 = await cart.listItem.findIndex(
      (item) => item.toString() === courseID
    );
    if (index !== -1) {
      return res.json({ message: "Already in wishlist" });
    } else if (index === -1 && index2 !== -1) {
      checkInCartItem = true;
      req.checkInCartItem = checkInCartItem;
      next();
    } else next();
  } else next();
};
//API
const addToCart = async (req, res, next) => {
  let { courseID, userID } = req.value.params;
  let oldCart = req.checkCart;
  let checkInWLItem = req.checkInWLItem;
  if (oldCart !== null && checkInWLItem) {
    oldCart.wishlist = oldCart.wishlist.filter(
      (item) => item.toString() !== courseID
    );
    oldCart.listItem.push(courseID);
    oldCart.save();
    return res.status(201).json({ message: "Course added to cart" });
  } else if (oldCart !== null) {
    oldCart.listItem.push(courseID);
    oldCart.save();
    return res.status(201).json({ message: "Course added to cart" });
  } else {
    let cart = new Carts({
      buyer: userID,
    });
    cart.listItem.push(courseID);
    await cart.save();
    res.status(201).json({ message: "Course added to cart" });
  }
};
const addToWishlist = async (req, res, next) => {
  let { courseID, userID } = req.value.params;
  let oldCart = req.checkCart;
  let checkInCartItem = req.checkInCartItem;

  if (oldCart !== null && checkInCartItem) {
    oldCart.listItem = oldCart.listItem.filter(
      (item) => item.toString() !== courseID
    );
    oldCart.wishlist.push(courseID);
    oldCart.save();
    return res.status(201).json({ message: "Course added to wishlist" });
  } else if (oldCart !== null) {
    oldCart.wishlist.push(courseID);
    oldCart.save();
    return res.status(201).json({ message: "Course added to wishlist" });
  } else {
    let cart = new Carts({
      buyer: userID,
    });
    cart.wishlist.push(courseID);
    await cart.save();
    res.status(201).json({ message: "Course added to wishlist" });
  }
};
const getCartByUserId = async (req, res, next) => {
  let { userID } = req.value.params;
  let cart = await Carts.findOne({ buyer: userID }, "listItem").populate({
    path: "listItem",
    select:
      "courseName thumbnail price courseCreators courseStudentList reviewCourse promotion paymentAcc",
    populate: [
      {
        path: "courseCreators",
        select: "firstName lastName",
      },
      {
        path: "promotion",
        select: "promotionArr",
      },
    ],
  });
  res.status(201).json(cart);
};
const getWishByUserId = async (req, res, next) => {
  let { userID } = req.value.params;
  let cart = await Carts.findOne({ buyer: userID }, "wishlist").populate({
    path: "wishlist",
    select:
      "courseName thumbnail price courseCreators courseStudentList reviewCourse promotion",
    populate: [
      {
        path: "courseCreators",
        select: "firstName lastName",
      },
      {
        path: "promotion",
        select: "promotionArr",
      },
    ],
  });
  res.status(201).json(cart);
};
const index = async (req, res, next) => {
  let carts = await Carts.find();
  res.json(carts);
};
const removeCartItem = async (req, res, next) => {
  let { itemID } = req.value.params;
  let cart = req.cart;
  cart.listItem = cart.listItem.filter((item) => item.toString() !== itemID);
  await cart.save();
  res.json({ message: "Cart item deleted" });
};
const removeWishlistItem = async (req, res, next) => {
  let { itemID } = req.value.params;
  let cart = req.cart;
  cart.wishlist = cart.wishlist.filter((item) => item.toString() !== itemID);
  await cart.save();
  res.json({ message: "Wishlist item deleted" });
};
const moveToCart = async (req, res, next) => {
  let { itemID } = req.value.params;
  let cart = req.cart;
  cart.wishlist = cart.wishlist.filter((item) => item.toString() !== itemID);
  cart.listItem.push(itemID);
  await cart.save();
  res.json({ message: "Cart item added" });
};
const moveToWishlist = async (req, res, next) => {
  let { itemID } = req.value.params;
  let cart = req.cart;
  cart.listItem = cart.listItem.filter((item) => item.toString() !== itemID);
  cart.wishlist.push(itemID);
  await cart.save();
  res.json({ message: "Wishlist item added" });
};
module.exports = {
  addToCart,
  addToWishlist,
  checkExistCart,
  checkExistItem,
  checkExistWLItem,
  getCartByUserId,
  getWishByUserId,
  getOneCart,
  index,
  moveToCart,
  moveToWishlist,
  removeCartItem,
  removeWishlistItem,
};
