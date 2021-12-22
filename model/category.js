const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  category: {
    type: String,
  },
  subCategoryList: [
    {
      subCategory: { type: String },
    },
  ],
});

// categorySchema.pre("remove", async (next) => {
//   let cateId = this._id;
//   this.courseTagged.map(async (index, item) => {
//     let course = await Courses.findById(item);
//     course.categories = course.categories.filter(
//       (item) => item.toString() !== cateId.toString()
//     );
//     await course.save();
//   });
//   next();
// });

const Categories = mongoose.model("Categories", categorySchema);
module.exports = Categories;
