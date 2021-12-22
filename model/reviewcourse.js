const mongoose = require("mongoose");
const Courses = require("./course");
const reviewCourseSchema = new mongoose.Schema({
  reviewArr: [
    {
      reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      ratingScore: { type: Number },
      review: { type: String },
      reviewAt: { type: Date },
      likers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
      dislikers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
      replies: [
        {
          replyAt: { type: Date },
          replier: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
          replyText: {
            type: String,
          },
        },
      ],
    },
  ],
  totalRating: { type: Number, default: 0 },
  typeRating: {
    fiveStar: {
      type: Number,
      default: 0,
    },
    fourStar: {
      type: Number,
      default: 0,
    },
    threeStar: {
      type: Number,
      default: 0,
    },
    twoStar: {
      type: Number,
      default: 0,
    },
    oneStar: {
      type: Number,
      default: 0,
    },
  },
  fromCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
});

const ReviewCourse = mongoose.model("ReviewCourse", reviewCourseSchema);
module.exports = ReviewCourse;
