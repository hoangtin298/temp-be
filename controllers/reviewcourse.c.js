const Courses = require("../model/course");
const ReviewCourse = require("../model/reviewcourse");

const getReviewForReq = async (req, res, next) => {
  let { courseId } = req.value.params;
  let reviewCourse = await ReviewCourse.findOne({ fromCourse: courseId });
  req.reviewCourse = reviewCourse;
  next();
};
const getReviewById = async (req, res, next) => {
  let { reviewcourseId } = req.value.params;
  let reviewCourse = await ReviewCourse.findById(reviewcourseId);
  req.reviewCourse = reviewCourse;
  next();
};
const getReviewOfStudent = async (req, res, next) => {
  let reviewCourse = req.reviewCourse;
  let { reviewId } = req.value.params;
  let reviewOfStudent = await reviewCourse.reviewArr.find(
    (review) => review._id.toString() == reviewId
  );
  req.reviewOfStudent = reviewOfStudent;
  next();
};
const getReviewByCourse = async (req, res, next) => {
  let { courseId } = req.value.params;
  let reviewCourse = await ReviewCourse.findOne(
    {
      fromCourse: courseId,
    },
    "reviewArr"
  )
    .populate("reviewArr.reviewer", "avatar firstName lastName -_id")
    .populate("reviewArr.replies.replier", "avatar firstName lastName -_id");
  res.status(201).json(reviewCourse);
};
const getAnalysisReviewByCourse = async (req, res, next) => {
  let { courseId } = req.value.params;
  let reviewCourse = await ReviewCourse.findOne(
    {
      fromCourse: courseId,
    },
    { "reviewArr.ratingScore": 1 }
  ).select("totalRating typeRating");
  let totalRating =
    Math.round(
      (Number(reviewCourse.totalRating) /
        Number(reviewCourse.reviewArr.length)) *
        10
    ) / 10;
  let totalTypes =
    Number(reviewCourse.typeRating.fiveStar) +
    Number(reviewCourse.typeRating.fourStar) +
    Number(reviewCourse.typeRating.threeStar) +
    Number(reviewCourse.typeRating.twoStar) +
    Number(reviewCourse.typeRating.oneStar);
  let typeRating = {
    fiveStar:
      Math.round(
        (Number(reviewCourse.typeRating.fiveStar) / totalTypes) * 100 * 100
      ) / 100,
    fourStar:
      Math.round(
        (Number(reviewCourse.typeRating.fourStar) / totalTypes) * 100 * 100
      ) / 100,
    threeStar:
      Math.round(
        (Number(reviewCourse.typeRating.threeStar) / totalTypes) * 100 * 100
      ) / 100,
    twoStar:
      Math.round(
        (Number(reviewCourse.typeRating.twoStar) / totalTypes) * 100 * 100
      ) / 100,
    oneStar:
      Math.round(
        (Number(reviewCourse.typeRating.oneStar) / totalTypes) * 100 * 100
      ) / 100,
  };
  let analysis = {
    totalRating: totalRating,
    typeRating: typeRating,
  };
  res.status(201).json(analysis);
};
const reviewCourse = async (req, res, next) => {
  let reviewCourse = req.reviewCourse;
  let user = req.user;
  let reviewAt = new Date();
  let ratingScore = Number(req.body.ratingScore);
  let reviewBody = { ...req.body, reviewer: user._id, reviewAt: reviewAt };
  reviewCourse.reviewArr.push(reviewBody);
  reviewCourse.totalRating = reviewCourse.totalRating + ratingScore;
  if (ratingScore === 5) {
    reviewCourse.typeRating.fiveStar += 1;
  } else if (ratingScore < 5 && ratingScore >= 4) {
    reviewCourse.typeRating.fourStar += 1;
  } else if (ratingScore < 4 && ratingScore >= 3) {
    reviewCourse.typeRating.threeStar += 1;
  } else if (ratingScore < 3 && ratingScore >= 2) {
    reviewCourse.typeRating.twoStar += 1;
  } else {
    reviewCourse.typeRating.oneStar += 1;
  }
  await reviewCourse
    .save()
    .then(async (result) => {
      let filter = { _id: result.fromCourse };
      let reviewCourse = {
        ratingScore:
          Math.round(
            (Number(result.totalRating) / Number(result.reviewArr.length)) * 10
          ) / 10,
        reviewCount: Number(result.reviewArr.length),
      };
      await Courses.findOneAndUpdate(filter, { reviewCourse: reviewCourse });
    })
    .catch((err) => {
      throw new Error("Something went wrong");
    });
  res.status(201).json("Your review has been sent");
};
const replyReview = async (req, res, next) => {
  let reviewCourse = req.reviewCourse;
  let user = req.user;
  let { replyText } = req.body;
  let replyAt = new Date();
  let reviewOfStudent = req.reviewOfStudent;
  reviewOfStudent.replies.push({ replyAt, replier: user._id, replyText });
  await reviewCourse.save();
  res.status(201).json("You have replied");
};
module.exports = {
  getReviewForReq,
  getReviewByCourse,
  getAnalysisReviewByCourse,
  getReviewById,
  getReviewOfStudent,
  reviewCourse,
  replyReview,
};
