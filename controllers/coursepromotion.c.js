const Courses = require("../model/course");
const CoursePromotion = require("../model/coursepromotion");

const index = async (req, res, next) => {
  let coursePromotionList = await CoursePromotion.find();
  res.status(201).json(coursePromotionList);
};

const getPromotionByCourse = async (req, res, next) => {
  let coursePromotion;
  let { courseId } = req.value.params;
  coursePromotion = await CoursePromotion.findOne(
    { fromCourse: courseId },
    "promotionArr"
  );
  if (!coursePromotion) {
    throw new Error("Cannot find this course promotion");
  } else {
    req.coursePromotion = coursePromotion;
    next();
  }
};

const saveCoursePromotion = async (req, res, next) => {
  let coursePromotion = req.coursePromotion;
  let { createdAt, saleOffPercent, expireDate } = req.body;
  let promotionItem = { createdAt, saleOffPercent, expireDate };
  coursePromotion.promotionArr.push(promotionItem);
  await coursePromotion.save();
  res.status(201).json({ message: "Course promotion executed" });
};

module.exports = {
  index,
  getPromotionByCourse,
  saveCoursePromotion,
};
