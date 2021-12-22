const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
  },
  description: {
    type: String,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
    default: 0,
  },
  approvalStatus: {
    type: String,
    enum: ["DRAFT", "PROCESSING", "PUBLIC"],
    default: "DRAFT",
  },
  previewVid: {
    type: String,
    default: null,
  },
  learningGoals: [{ type: String }],
  learningRequirements: [{ type: String }],
  category: {
    mainCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Categories" },
    subCategory: { type: String, default: "" },
  },
  courseSections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sections",
    },
  ],
  courseCreators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  courseStudentList: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      registerAt: { type: Date },
    },
  ],
  paymentAcc: {
    type: String,
    default: "",
  },
  promotion: { type: mongoose.Schema.Types.ObjectId, ref: "CoursePromotion" },
  reviewCourse: {
    ratingScore: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
});

// courseSchema.pre("save", async function (next) {
//   let courseId = this._id;
//   let cateId = this.category.toString();
//   console.log(cateId);
//   let category = await Categories.findById(cateId);
//   category.courseTagged.push(courseId);
//   await category.save();
//   next();
// });
// courseSchema.pre("delete", async function (next) {
//   let courseId = this._id;
//   let cateID = this.categories;
//   let category = await Categories.findById(cateID);
//   category.courseTagged = category.courseTagged.filter(
//     (coursetagged) => coursetagged.toString() !== courseId.toString()
//   );
//   await category.save();
//   next();
// });
const Courses = mongoose.model("Courses", courseSchema);
module.exports = Courses;
