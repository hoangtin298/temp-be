const CourseForum = require("../model/courseForum");

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
const getForumFromCourse = async (req, res, next) => {
  let { courseId } = req.value.params;
  let courseForum;
  courseForum = await CourseForum.findOne({ fromCourse: courseId });
  if (!courseForum) {
    throw new Error("Cannot find forum in this course");
  } else {
    req.courseForum = courseForum;
    next();
  }
};

const getCourseForumByCourse = async (req, res, next) => {
  let { courseId } = req.value.params;
  let { keyword } = req.query;
  const regex = new RegExp(escapeRegex(keyword), "gi");
  let courseForum = await CourseForum.findOne({
    fromCourse: courseId,
  })
    .populate("postArr.creator", "firstName lastName email")
    .populate({
      path: "postArr.replyArr.replier",
      select: "firstName lastName email",
    });
  if (!courseForum) {
    throw new Error("Course forum not found");
  } else {
    res.status(201).json(courseForum);
  }
};
const createPost = async (req, res, next) => {
  let forum = req.courseForum;
  let { creator, postTitle, postContent } = req.body;
  console.log(creator, postTitle, postContent);
  let createAt = new Date();
  forum.postArr.push({ createAt, postTitle, postContent, creator });
  await forum.save();
  res.status(201).json({ message: "Your post created" });
};
module.exports = { getForumFromCourse, getCourseForumByCourse, createPost };
