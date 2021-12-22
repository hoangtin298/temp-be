const mongoose = require("mongoose");
const courseRevenueSchema = new mongoose.Schema({
  fromCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
  fromLecturerList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  revenueCourse: [
    {
      payedForCourse: { type: Number },
      buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      createAt: { type: Date },
    },
  ],
});

const CourseRevenue = mongoose.model("CourseRevenue", courseRevenueSchema);
module.exports = CourseRevenue;
