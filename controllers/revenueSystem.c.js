const RevenueSystem = require("../model/revenueSystem");
const Users = require("../model/user");
const Courses = require("../model/course");
const Categories = require("../model/category");
const calRevenueByMonth = (listRevenues, month) =>
  listRevenues.reduce((sum, current) => {
    if (current.createdAt.getMonth() + 1 === month)
      return sum + current.courseFee;
    return sum;
  }, 0);
const checkAdmin = async (req, res, next) => {
  let user = req.user;
  if (user.userType === "Admin") {
    next();
  } else {
    throw new Error("You are not administrator");
  }
};
const createRevenueSystem = async (req, res, next) => {
  let revenueSystem = new RevenueSystem({
    fromCourse: "619e14fd883ce9bab453d699",
    courseFee: Math.floor(Math.random() * 33.7),
  });
  await revenueSystem.save();
  res.json({ message: "Created" });
};
const getRevenueForChart = async (req, res, next) => {
  const { year } = req.query;
  const foundRevenueSystem = await RevenueSystem.find({
    createdAt: {
      $gte: new Date(+2021, 0, 1),
      $lte: new Date(+2021, 11, 31),
    },
  })
    .lean()
    .populate({
      path: "fromCourse",
      select: "-courseSections -paymentAcc",
      populate: [
        {
          path: "courseCreators",
          model: "Users",
          select: "firstName lastName",
        },
        {
          path: "promotion",
          model: "CoursePromotion",
          select: "promotionArr",
        },
      ],
    });
  const yearRevenue = [...Array(12).keys()].map((e) =>
    calRevenueByMonth(foundRevenueSystem, +e + 1)
  );

  let checkedID = [];
  let tempCourses = [];
  let topCourses = [];
  for (const rev of foundRevenueSystem) {
    if (
      !checkedID.some((e) => e.toString() === rev.fromCourse._id.toString())
    ) {
      checkedID.push(rev.fromCourse._id.toString());
      tempCourses.push({
        course: rev.fromCourse,
        quantity: 1,
      });
    } else {
      tempCourses.forEach((e) => {
        if (e.course._id.toString() === rev.fromCourse._id.toString())
          e.quantity += 1;
      });
    }
  }
  tempCourses.sort((a, b) => b.quantity - a.quantity);
  for (const e of tempCourses) {
    topCourses.push(e.course);
  }
  res.status(201).json({ yearRevenue, topCourses });
};
const getAnalysisUser = async (req, res, next) => {
  let userList = await Users.find({}, "_id userType coursesStudying authType");
  let totalUser = userList.length;
  let totalOnlineStudent = 0;
  let totalLecturer = 0;
  let totalLocal = 0;
  let totalGmail = 0;
  let totalFb = 0;
  for (let user of userList) {
    if (user.userType === "OnlineLecturer") {
      totalLecturer += 1;
    }
    if (
      (user.userType === "User" && user.coursesStudying.length > 0) ||
      (user.userType === "OnlineLecturer" && user.coursesStudying.length > 0)
    ) {
      totalOnlineStudent += 1;
    }
  }
  for (let user of userList) {
    if (user.authType === "local") {
      totalLocal += 1;
    } else if (user.authType === "google") {
      totalGmail += 1;
    } else if (user.authType === "facebook") {
      totalFb += 1;
    }
  }
  res.status(201).json({
    totalUser: totalUser,
    totalOnlineStudent: totalOnlineStudent,
    totalLecturer: totalLecturer,
    totalLocal: totalLocal,
    totalGmail: totalGmail,
    totalFb: totalFb,
  });
};
const getAnalysisCourse = async (req, res, next) => {
  let courseList = await Courses.find({}, "_id category");
  let categoryList = await Categories.find({}, "_id category");
  let categoryLabel = [];
  let countCourseByCategory = [];
  let courseByCategory = [];
  for (let cate of categoryList) {
    categoryLabel.push(cate.category);
    countCourseByCategory.push({ _id: cate._id, countCourse: 0 });
  }
  for (let course of courseList) {
    countCourseByCategory.map((e) => {
      if (e._id.toString() === course.category.mainCategory._id.toString()) {
        e.countCourse += 1;
      }
    });
  }
  await countCourseByCategory.map((e) => {
    courseByCategory.push(e.countCourse);
  });
  res.status(201).json({ categoryLabel, courseByCategory });
};
const getTotalRevenue = async (req, res, next) => {
  const foundRevenueSystem = await RevenueSystem.find();
  let totalRevenue = foundRevenueSystem.reduce((sum, current) => {
    return sum + current.courseFee;
  }, 0);
  res.status(201).json(totalRevenue);
};
const getCourseByReviewScore = async (req, res, next) => {
  let courses = await Courses.find({}, "-courseSections -paymentAcc")
    .where("reviewCourse.ratingScore")
    .gt(3.5)
    .populate("promotion", "promotionArr")
    .populate("courseCreators", "firstName lastName");
  if (!courses) {
    res.json({ message: "There no course" });
  } else {
    courses.sort(
      (a, b) => b.reviewCourse.ratingScore - a.reviewCourse.ratingScore
    );
    res.status(201).json(courses);
  }
};
module.exports = {
  checkAdmin,
  createRevenueSystem,
  getRevenueForChart,
  getAnalysisUser,
  getAnalysisCourse,
  getTotalRevenue,
  getCourseByReviewScore,
};
