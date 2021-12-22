const RevenueCourse = require("../model/revenueCourse");
const Users = require("../model/user");
const Courses = require("../model/course");
const calRevenueByMonth = (listRevenues, month) =>
  listRevenues.reduce((sum, current) => {
    if (current.createAt.getMonth() + 1 === month)
      return sum + current.payedForCourse;
    return sum;
  }, 0);
const calStudentByMonth = (listStudent, month) =>
  listStudent.reduce((sum, current) => {
    if (current.registerAt.getMonth() + 1 === month) return (sum += 1);
    return sum;
  }, 0);
const getRevenueCourseByYear = (revenueList, year) => {
  let array = revenueList.filter(
    (item) => item.createAt.getFullYear() === year
  );
  let revenueListSorted = array.sort((i, j) => {
    let dateA = i.createAt.getTime();
    let dateB = j.createAt.getTime();
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    }
    return 0;
  });
  return revenueListSorted;
};
const createRevenueCourse = async (req, res, next) => {
  let lectId = "616173aa6e59ace569a256bd";
  let revenueCourse = new RevenueCourse({
    fromCourse: "619e14fd883ce9bab453d699",
  });
  revenueCourse.fromLecturerList.push(lectId);
  await revenueCourse.save();
  res.json({ message: "Created" });
};
const createDataForCRevenue = async (req, res, next) => {
  let { courseId, lecId } = req.value.params;
  let foundRevenueCourse = await RevenueCourse.findOne({
    fromCourse: courseId,
    fromLecturerList: lecId,
  });
  let futureDate = new Date();
  foundRevenueCourse.revenueCourse.push({
    payedForCourse: Math.floor(Math.random() * 33.7),
    buyer: "616173aa6e59ace569a256bd",
    createAt: futureDate.setDate(new Date().getDate() - 2),
  });
  await foundRevenueCourse.save();
  res.json({ message: "Revenue added" });
};
const getRevenueForChart = async (req, res, next) => {
  // const { year } = req.query;
  let { courseId, lecId } = req.value.params;
  const foundRevenueCourse = await RevenueCourse.findOne({
    fromCourse: courseId,
    fromLecturerList: lecId,
  });
  if (foundRevenueCourse.revenueCourse.length > 0) {
    const arr = await getRevenueCourseByYear(
      foundRevenueCourse.revenueCourse,
      2021
    );
    const yearRevenue = [...Array(12).keys()].map((e) =>
      calRevenueByMonth(arr, +e + 1)
    );
    let month = new Date().getMonth();
    let totalLastMonth = yearRevenue[month - 1];
    let totalMonth = yearRevenue[month];
    const totalYear = yearRevenue.reduce((sum, current) => sum + current, 0);
    res
      .status(201)
      .json({ yearRevenue, totalLastMonth, totalMonth, totalYear });
  } else {
    res
      .status(201)
      .json({
        yearRevenue: [],
        totalLastMonth: 0,
        totalMonth: 0,
        totalYear: 0,
      });
  }
};
const getUserForChart = async (req, res, next) => {
  let { courseId, lecId } = req.value.params;
  let studentInCourseList = await Courses.findOne(
    {
      _id: courseId,
      courseCreators: lecId,
    },
    "courseStudentList"
  );

  if (studentInCourseList.courseStudentList.length > 0) {
    const yearStudent = [...Array(12).keys()].map((e) =>
      calStudentByMonth(studentInCourseList.courseStudentList, +e + 1)
    );
    let month = new Date().getMonth();
    let totalLastMonth = yearStudent[month - 1];
    let totalMonth = yearStudent[month];
    const totalYear = yearStudent.reduce((sum, current) => sum + current, 0);
    res
      .status(201)
      .json({ yearStudent, totalLastMonth, totalMonth, totalYear });
  } else {
    res.status(201).json({
      yearStudent: [],
      totalLastMonth: 0,
      totalMonth: 0,
      totalYear: 0,
    });
  }
};

module.exports = {
  createRevenueCourse,
  createDataForCRevenue,
  getRevenueForChart,
  getUserForChart,
};
