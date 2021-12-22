let Users = require("../model/user");
let Courses = require("../model/course");

const getPayedCoursesForStu = async (req, res, next) => {
  let { userId } = req.value.params;
  let courseList = await Courses.find(
    { "courseStudentList.student": userId },
    "-courseSections -paymentAcc"
  )
    .populate("courseCreators", "firstName lastName")
    .populate("promotion", "promotionArr");
  if (!courseList) {
    throw new Error("Cannot find your registered courses");
  } else {
    res.status(201).json(courseList);
  }
};
const getCourseStudyContent = async (req, res, next) => {
  let { courseId } = req.value.params;
  let user = req.user;
  let studyContent = await Courses.findOne(
    { _id: courseId, "courseStudentList.student": user._id.toString() },
    "courseName courseSections"
  ).populate({
    path: "courseSections",
    match: { publishStatus: true },
    select: "sectionTitle listLecture countSection",
    populate: [
      {
        path: "contentVideo",
        model: "SecVideoLecture",
        select: "-_id",
      },
      {
        path: "contentArticle",
        model: "SecArticles",
        select: "-_id",
      },
    ],
  });
  if (!studyContent) {
    throw new Error("Cannot find the course's content");
  } else {
    res.status(201).json(studyContent);
  }
};

module.exports = {
  getPayedCoursesForStu,
  getCourseStudyContent,
};
