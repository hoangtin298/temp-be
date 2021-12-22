const Courses = require("../model/course");
const Users = require("../model/user");
const RevenueCourse = require("../model/revenueCourse");

const calRevenue = (listRevenues) =>
  listRevenues.reduce((sum, current) => {
    return sum + current.payedForCourse;
  }, 0);
const getStudentPerCourse = async (req, res, next) => {
  let { courseId } = req.value.params;
  let { keyword } = req.query;
  let studentCourses = await RevenueCourse.findOne(
    { fromCourse: courseId },
    "revenueCourse"
  ).populate("revenueCourse.buyer", "email firstName lastName avatar");
  if (keyword) {
    let stdListWithKW = studentCourses.revenueCourse.filter(
      (std) =>
        std.buyer.email.toUpperCase().includes(keyword.toUpperCase()) ||
        std.buyer.firstName.toUpperCase().includes(keyword.toUpperCase()) ||
        std.buyer.lastName.toUpperCase().includes(keyword.toUpperCase())
    );
    res
      .status(201)
      .json({ _id: studentCourses._id, revenueCourse: stdListWithKW });
  } else {
    res.status(201).json(studentCourses);
  }
};

const getTotalStudentAllCourse = async (req, res, next) => {
  let { lecId } = req.value.params;
  let courseOfLec = await Courses.find(
    { courseCreators: lecId },
    "courseStudentList"
  );
  let totalRevenue = await RevenueCourse.find(
    { fromLecturerList: lecId },
    "revenueCourse"
  );
  let totalStudentCourses = 0;
  for (const course of courseOfLec) {
    totalStudentCourses += course.courseStudentList.length;
  }
  let totalCount = 0;
  // console.log(totalRevenue.toString());
  for (const revCourse of totalRevenue) {
    if (revCourse.revenueCourse.length > 0) {
      totalCount = totalCount + calRevenue(revCourse.revenueCourse);
    } else {
      totalCount = totalCount;
    }
  }
  if (!courseOfLec) {
    throw new Error("Not found");
  } else {
    res.status(201).json({
      totalStudent: totalStudentCourses,
      totalCourse: courseOfLec.length,
      totalRevenue: totalCount,
    });
  }
};

const testAddStuToCourse = async (req, res, next) => {
  let { courseId } = req.value.params;
  let course = await Courses.findById(courseId, "courseStudentList");
  let stulist = await Users.find().select("_id");
  stulist.map((item, index) => {
    course.courseStudentList.push({ student: item, registerAt: new Date() });
  });
  course.save();
  res.json("add thanh cong");
};

const addPaymentMethodForCourse = async (req, res, next) => {
  let { courseId } = req.value.params;
  let { paymentAcc } = req.body;
  let course = await Courses.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  } else {
    course.paymentAcc = paymentAcc;
    await course.save();
    res.status(201).json({ message: "Payment added" });
  }
};
module.exports = {
  getStudentPerCourse,
  getTotalStudentAllCourse,
  testAddStuToCourse,
  addPaymentMethodForCourse,
};
