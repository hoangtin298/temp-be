const mongoose = require("mongoose");
const coursepromotionSchema = new mongoose.Schema({
  fromCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
  promotionArr: [
    {
      createdAt: {
        type: Date,
      },
      saleOffPercent: {
        type: Number,
      },
      expireDate: {
        type: Date,
      },
    },
  ],
  couponArr: [
    {
      createdAt: {
        type: Date,
      },
      coupon: [
        {
          code: { type: String },
          couponPercent: {
            type: Number,
          },
          couponStatus: {
            type: Boolean,
          },
        },
      ],
      expireDate: {
        type: Date,
      },
    },
  ],
});

const CoursePromotion = mongoose.model(
  "CoursePromotion",
  coursepromotionSchema
);
module.exports = CoursePromotion;
