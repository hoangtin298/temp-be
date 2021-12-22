const jwt = require("jsonwebtoken");
const Users = require("../model/user");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const sendMailMiddleware = require("../middleware/sendMail");
//CLOUDINARY
const cloudUploader = require("../config/cloudConfig");
const { link } = require("@hapi/joi");
//SUB
const generateAuthToken = (userID) => {
  return jwt.sign(
    {
      issuer: "HKT Elearning",
      data: userID,
    },
    process.env.TOKEN_KEY,
    { expiresIn: "48h" }
  );
};
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
const randomString = () => {
  const len = 6;
  let randStr = "";
  for (let i = 0; i < len; i++) {
    const ch = Math.floor(Math.random() * 9 + 1);
    randStr += ch;
  }
  return randStr;
};
// HANDLE API
const afterConfirmation = async (req, res, next) => {
  let { uniqueString } = req.params;
  const user = await Users.findOne({ uniqueStr: uniqueString });
  if (user) {
    if (user.userType === "OnlineLecturer") {
      user.userType = "User";
      user.userStatus = "PROCESSING";
    } else {
      user.userStatus = "READY";
    }
    await user.save();
    res.redirect(`${process.env.REAL_HOST_DOMAIN}/auth/sign-in`);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
const approveUserToLec = async (req, res, next) => {
  let result = req.user;
  if (result.userType === "User") {
    result.userType = "OnlineLecturer";
  }
  result.userStatus = "READY";
  await result.save();
  res.json({ message: "User approved" });
};
const activeUser = async (req, res, next) => {
  let result = req.user;
  result.userStatus = "READY";
  await result.save();
  res.json({ message: "User activated" });
};

const getCodeByEmail = async (req, res, next) => {
  let { email } = req.body;
  const code = randomString();
  let user = await Users.findOne({ email: email });
  if (!user) {
    throw new Error("Your email is not correct");
  } else {
    user.uniqueStr = code;
    await user.save();
    sendMailMiddleware.sendMailToChangePW(
      user.email,
      user.firstName,
      user.lastName,
      code
    );
    res
      .status(201)
      .json({ message: "Your code has sent, please check your email" });
  }
};
const forgetPassword = async (req, res, next) => {
  let { email, newPassword, code } = req.body;
  let user = await Users.findOne({ email: email });
  if (user.uniqueStr === code) {
    user.password = newPassword;
    await user.save();
    res.status(201).json({ message: "Change password successfully" });
  } else {
    res.status(500).json({ message: "Your verify code is not correct" });
  }
};
const changePwUser = async (req, res, next) => {
  let user = req.user;
  let { oldPassword, newPassword } = req.body;
  let check = await bcrypt.compare(oldPassword, user.password);
  if (!check) {
    res.status(500).json({ message: "Your old password is not correct" });
  } else {
    user.password = newPassword;
    await user.save();
    res.status(201).json({ message: "Change password successfully" });
  }
};
const deleteUser = async (req, res, next) => {
  let result = req.user;
  const thePath = "Users/" + result.firstName + " " + result.lastName;
  if (result.avatar !== null || result.verifyImages.length > 0) {
    await cloudUploader.cloudinary.api.delete_resources_by_prefix(
      `${thePath}/`,
      { resource_type: "image" },
      async (err, result) => {
        if (err) throw new Error(err.toString());
        await cloudUploader.cloudinary.api.delete_folder(`${thePath}/`);
      }
    );
    await result.remove();
    res.status(201).json({ message: "User deleted" });
  } else {
    await result.remove();
    res.status(201).json({ message: "User deleted" });
  }
};
const deActivateUser = async (req, res, next) => {
  let result = req.user;
  result.userStatus = "INACTIVE";
  await result.save();
  res.json({ message: "User deactivated" });
};
const getUser = async (req, res, next) => {
  let user;
  let { userID } = req.value.params;
  try {
    user = await Users.findById(userID);
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  req.user = user;
  next();
};
const getUserByID = async (req, res, next) => {
  let user = req.user;
  res.status(201).json(user);
};
const getUserAllOrKeyword = async (req, res, next) => {
  const { keyword } = req.query;
  let users;
  if (keyword) {
    const regex = new RegExp(escapeRegex(keyword), "gi");
    users = await Users.find({
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
    }).select(
      "_id firstName lastName email avatar userType authType userStatus"
    );
    res.status(201).json(users);
  } else {
    users = await Users.find().select(
      "_id firstName lastName email avatar userType authType userStatus"
    );
    res.status(201).json(users);
  }
};
const getUserUnderApproval = async (req, res, next) => {
  const { keyword } = req.query;
  let listUser;
  if (keyword) {
    const regex = new RegExp(escapeRegex(keyword), "gi");
    listUser = await Users.find({
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
    })
      .select(
        "_id firstName lastName email avatar userType authType userStatus"
      )
      .where("userStatus")
      .equals("PROCESSING");
    res.status(201).json(listUser);
  } else {
    listUser = await Users.find()
      .select(
        "_id firstName lastName email avatar userType authType verifyImages linkCV userStatus"
      )
      .where("userStatus")
      .equals("PROCESSING");
    res.status(201).json(listUser);
  }
};
const getLecturerActive = async (req, res, next) => {
  const { keyword } = req.query;
  let listUser;
  if (keyword) {
    const regex = new RegExp(escapeRegex(keyword), "gi");
    listUser = await Users.find({
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
    })
      .select(
        "_id firstName lastName email avatar userType authType userStatus"
      )
      .where("userType")
      .equals("OnlineLecturer")
      .where("userStatus")
      .equals("READY");
    res.status(201).json(listUser);
  } else {
    listUser = await Users.find()
      .select(
        "_id firstName lastName email avatar userType authType verifyImages linkCV userStatus"
      )
      .where("userType")
      .equals("OnlineLecturer")
      .where("userStatus")
      .equals("READY");
    res.status(201).json(listUser);
  }
};
const index = async (req, res, next) => {
  const users = await Users.find({});
  return res.status(201).json({ users });
};
const login = async (req, res, next) => {
  const user = req.user;
  const id = user._id.toString();
  const accessToken = generateAuthToken(id);
  res.status(201).json({ user, accessToken });
};
const loginFacebook = async (req, res, next) => {
  const user = req.user;
  const id = user._id.toString();
  const accessToken = generateAuthToken(id);
  res.status(201).json({ user, accessToken });
};
const loginGoogle = async (req, res, next) => {
  const user = req.user;
  const id = user._id.toString();
  const accessToken = generateAuthToken(id);
  res.status(201).json({ user, accessToken });
};
const register = async (req, res, next) => {
  const newUser = new Users(req.value.body);
  const email = newUser.email;
  const firstName = newUser.firstName;
  const lastName = newUser.lastName;
  const uniqueString = randomString();
  const check = await Users.findOne({ email });
  if (check) {
    return res.status(403).json({
      message: "This account has already registered, please choose another one",
    });
  } else {
    newUser.userStatus = "UNCONFIRMED";
    newUser.uniqueStr = uniqueString;
    await newUser.save();
    sendMailMiddleware.sendMailConfirm(
      email,
      firstName,
      lastName,
      uniqueString
    );
    return res
      .status(201)
      .json({ message: "Check your email for verification" });
  }
};
const registerForTeaching = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.value.body;
  const uniqueString = randomString();
  const check = await Users.findOne({ email });
  if (check) {
    return res.status(403).json({
      message: "This account has already registered, please choose another one",
    });
  } else {
    const newUser = new Users({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      userStatus: "UNCONFIRMED",
      userType: "OnlineLecturer",
    });
    newUser.uniqueStr = uniqueString;
    await newUser.save();
    sendMailMiddleware.sendMailConfirm(
      email,
      firstName,
      lastName,
      uniqueString
    );
    return res
      .status(201)
      .json({ message: "Check your email for verification", newUser });
  }
};
const replaceUser = async (req, res, next) => {
  // enforce new user to old user
  const { userID } = req.value.params;

  const newUser = req.value.body;

  const result = await Users.findByIdAndUpdate(userID, newUser);

  return res.status(201).json({ message: "Updated seccessfully" });
};
const updateUser = async (req, res, next) => {
  // number of fields
  const { userID } = req.value.params;

  const newUser = req.value.body;

  const result = await Users.findByIdAndUpdate(userID, newUser);

  return res.status(201).json({ message: "Updated seccessfully" });
};
const uploadAvatar = async (req, res, next) => {
  const user = req.user;

  if (req.file) {
    const fileName = req.file.filename.split(".")[0];
    const localPath = req.file.path;
    const userfolder = user.firstName + " " + user.lastName;
    const folderCloud = `Users/${userfolder}/${fileName}`;
    await cloudUploader.cloudinary.uploader.upload(
      localPath,
      { public_id: folderCloud },
      async (err, result) => {
        if (err) {
          fs.unlinkSync(localPath);
          return res.json({ message: "Fail to upload" });
        }
        fs.unlinkSync(localPath);
        user.avatar = result.url;
        await user.save();
        return res.json({ message: "Uploaded" });
      }
    );
  }
};
const uploadVerifyImages = async (req, res, next) => {
  let user = req.user;
  let { linkCV, img1, img2 } = req.body;
  user.linkCV = linkCV;
  const userfolder = user.firstName + " " + user.lastName;
  if (req.files) {
    req.files.map(async (file, index) => {
      const fileName = file.filename.split(".")[0];
      const localPath = file.path;
      const folderCloud = `Users/${userfolder}/${fileName}`;
      cloudUploader.cloudinary.uploader
        .upload(localPath, { public_id: folderCloud })
        .then(async (result) => {
          fs.unlinkSync(localPath);
          index === 0 && img1 === "true"
            ? (user.verifyImages.img1 = result.url)
            : (user.verifyImages.img2 = result.url);
          await user.save();
        })
        .catch((err) => {
          fs.unlinkSync(localPath);
          return res.json({ message: "Fail to upload" });
        });
    });
  }
  await user.save();
  res.json({ message: "Requirements uploaded" });
};
const requestForTeaching = async (req, res, next) => {
  let user = req.user;
  user.userStatus = "PROCESSING";
  await user.save();
  res.json({ message: "Your request has been sent" });
};
const sendMailInform = async (req, res, next) => {
  let { email, subject, content } = req.body;
  sendMailMiddleware.sendMailInform(email, subject, content);
  res.status(201).json({ message: "Mail sent successfully" });
};

module.exports = {
  afterConfirmation,
  getUser,
  getUserByID,
  getUserAllOrKeyword,
  getUserUnderApproval,
  getLecturerActive,
  index,
  register,
  login,
  loginFacebook,
  loginGoogle,
  replaceUser,
  registerForTeaching,
  requestForTeaching,
  updateUser,
  deleteUser,
  uploadAvatar,
  uploadVerifyImages,
  approveUserToLec,
  activeUser,
  deActivateUser,
  changePwUser,
  getCodeByEmail,
  forgetPassword,
  sendMailInform,
};
