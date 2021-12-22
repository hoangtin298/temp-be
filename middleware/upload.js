const multer = require("multer");
const saltedMd5 = require("salted-md5");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const hanldeName = saltedMd5(file.originalname, "SUPER-S@LT!");
    const filename = hanldeName + path.extname(file.originalname);
    cb(null, filename);
  },
});
const forImg = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(
        null,
        new Error(
          "Unacceptable file type, just supporting for png, jpg and gif"
        )
      );
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});
const forVid = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "video/mp4") {
      cb(null, true);
    } else {
      cb(null, new Error("Unacceptable file type, just supporting for mp4"));
    }
  },
});
const forFile = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 40,
  },
});
module.exports = {
  forImg,
  forVid,
  forFile,
};
