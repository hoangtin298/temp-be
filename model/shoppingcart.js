const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  listItem: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    },
  ],
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});
const Carts = mongoose.model("Carts", cartSchema);
module.exports = Carts;
