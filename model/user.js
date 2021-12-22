const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Carts = require("./shoppingcart");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  userType: {
    type: String,
    default: "User",
  },
  avatar: {
    type: String,
    default: null,
  },
  verifyImages: {
    img1: {
      type: String,
      default: null,
    },
    img2: {
      type: String,
      default: null,
    },
  },
  linkCV: {
    type: String,
  },

  userStatus: {
    type: String,
    enum: ["READY", "PROCESSING", "INACTIVE", "UNCONFIRMED"],
    default: "READY",
  },
  uniqueStr: { type: String },
  authGoogleID: {
    type: String,
    default: null,
  },
  authFacebookID: {
    type: String,
    default: null,
  },
  authType: {
    type: String,
    enum: ["local", "google", "facebook"],
    default: "local",
  },
  coursesCreating: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    },
  ],
  coursesStudying: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    },
  ],
});
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  if (user.userType !== "OnlineLecturer") {
    delete user.paymentAcc;
  }
  delete user.password;
  delete user.authGoogleID;
  delete user.authFacebookID;
  return user;
};
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (e) {
    throw new Error(e);
  }
};

userSchema.pre("save", async function (next) {
  try {
    if (this.authType !== "local") next();
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre("remove", async function (next) {
  const user = this.toObject();
  await Carts.deleteOne({ buyer: user._id });
  next();
});
const Users = mongoose.model("Users", userSchema);
module.exports = Users;
