const Courses = require("../model/course");
const Users = require("../model/user");
const Categories = require("../model/category");
const ReviewCourse = require("../model/reviewcourse");
const CourseForums = require("../model/courseForum");
const CoursePromotion = require("../model/coursepromotion");
const RevenueCourse = require("../model/revenueCourse");
const fs = require("fs");
//CLOUDINARY
const cloudUploader = require("../config/cloudConfig");
//SUB_HANDLING FUNC
const getOneCourse = async (req, res, next) => {
  let course;
  const { courseID } = req.value.params;
  try {
    course = await Courses.findById(courseID);
    if (course == null) {
      return res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
  req.course = course;
  next();
};
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
//HANDLING API FUNC
const addCoCreator = async (req, res, next) => {
  let course = req.course;
  let { creatorsList } = req.body;
  creatorsList.map(async (item, index) => {
    course.courseCreators.push(item);
    let creator = await Users.findById(item, "coursesCreating");
    creator.coursesCreating.push(course._id);
    await creator.save();
  });
  await course.save();
  res.status(201).json({ message: "Co-creators have been added" });
};
const addCourseGoals = async (req, res, next) => {
  let course = req.course;
  let { goals } = req.body;
  course.learningGoals = goals;
  await course.save();
  res.status(201).json({ message: "Course goal added" });
};
const addCourseRequirements = async (req, res, next) => {
  let course = req.course;
  let { requirements } = req.body;
  course.learningRequirements = requirements;
  await course.save();
  res.status(201).json({ message: "Course requirement added" });
};
const addCourseThumbnail = async (req, res, next) => {
  let course = req.course;
  if (req.file) {
    const fileName = req.file.filename.split(".")[0];
    const localPath = req.file.path;
    const folderCloud = `Courses/img/${fileName}`;
    cloudUploader.cloudinary.uploader.upload(
      localPath,
      { public_id: folderCloud },
      async (err, result) => {
        if (result) {
          fs.unlinkSync(localPath);
          course.thumbnail = result.url;
          await course.save();
          return res.json({ message: "Uploaded" });
        } else {
          fs.unlinkSync(localPath);
          return res.json({ message: "Fail to upload" });
        }
      }
    );
  }
};
const addCoursePreviewVid = async (req, res, next) => {
  let course = req.course;
  if (req.files[0]) {
    const fileName = req.files[0].filename.split(".")[0];
    const localPath = req.files[0].path;
    const folderCloud = `Courses/video/${fileName}`;
    cloudUploader.cloudinary.uploader.upload(
      localPath,
      {
        resource_type: "video",
        public_id: folderCloud,
        chunk_size: 6000000,
      },
      async (err, result) => {
        if (result) {
          fs.unlinkSync(localPath);
          course.previewVid = result.url;
          await course.save();
          return res.json({ message: "Uploaded" });
        } else {
          fs.unlinkSync(localPath);
          return res.json({ message: "Fail to upload" });
        }
      }
    );
  }
};
const createCourse = async (req, res, next) => {
  let creator = req.user;
  let { courseName, description, category } = req.body;
  let newCourse = new Courses();
  newCourse.courseName = courseName;
  newCourse.description = description;
  newCourse.category.mainCategory = category;
  newCourse.courseCreators.push(creator._id);
  await newCourse
    .save()
    .then(async (result) => {
      creator.coursesCreating.push(result._id);
      await creator.save();
    })
    .catch((err) => {
      throw new Error(err);
    });
  res.status(201).json(newCourse);
};
const deactivateCourse = async (req, res, next) => {
  let course = req.course;
  course.approvalStatus = "DRAFT";
  await course.save();
  res.status(201).json({ message: "Course deactivated" });
};
const getCourseDetail = async (req, res, next) => {
  const { courseID } = req.value.params;
  let course = await Courses.findById(courseID)
    .populate("courseCreators", "firstName lastName avatar coursesCreating")
    .populate("category.mainCategory", "category")
    .populate({
      path: "courseSections",
      match: { publishStatus: true },
      model: "Sections",
      select: "sectionTitle listLecture countSection",
      populate: [
        {
          path: "listLecture.contentVideo",
          model: "SecVideoLecture",
          select: "-_id",
        },
        {
          path: "listLecture.contentArticle",
          model: "SecArticles",
          select: "-_id",
        },
      ],
    })
    .populate("promotion", "promotionArr");
  res.status(201).json(course);
};
const getCourseByKeyWord = async (req, res, next) => {
  const { keyword } = req.query;
  let courses;
  let regexSpe;

  if (keyword) {
    const regex = new RegExp(escapeRegex(keyword), "gi");
    if (parseFloat(keyword)) {
      regexSpe = parseFloat(keyword);
    }
    courses = await Courses.find(
      {
        $or: [
          { courseName: regex },
          { description: regex },
          { price: regexSpe },
          // { courseCreators: regex },
        ],
      },
      "-courseSections -paymentAcc"
    )
      .where("approvalStatus")
      .equals("PUBLIC")
      .populate("courseCreators", "firstName lastName")
      .populate("promotion", "promotionArr");

    res.status(201).json(courses);
  } else {
    courses = await Courses.find({}, "-courseSections -paymentAcc")
      .where("approvalStatus")
      .equals("PUBLIC")
      .populate("courseCreators", "firstName lastName")
      .populate("promotion", "promotionArr");
    res.status(201).json(courses);
  }
};
const getCourseUnderApproval = async (req, res, next) => {
  const { keyword } = req.query;
  let courses;
  let regexSpe;

  if (keyword) {
    const regex = new RegExp(escapeRegex(keyword), "gi");
    if (parseFloat(keyword)) {
      regexSpe = parseFloat(keyword);
    }
    courses = await Courses.find(
      {
        $or: [
          { courseName: regex },
          { description: regex },
          { price: regexSpe },
          // { courseCreators: regex},
        ],
      },
      "-courseSections -paymentAcc"
    )
      .where("approvalStatus")
      .equals("PROCESSING")
      .populate("courseCreators", "firstName lastName")
      .populate({ path: "category.mainCategory" })
      .populate("promotion", "promotionArr");
    res.status(201).json(courses);
  } else {
    courses = await Courses.find({}, "-courseSections -paymentAcc")
      .where("approvalStatus")
      .equals("PROCESSING")
      .populate("courseCreators", "firstName lastName")
      .populate({ path: "category.mainCategory" })
      .populate("promotion", "promotionArr");
    res.status(201).json(courses);
  }
};
const index = async (req, res, next) => {
  const courses = await Courses.find();
  res.status(201).json(courses);
};
const publishCourse = async (req, res, next) => {
  let course = req.course;
  let courseId = course._id;
  course.approvalStatus = "PUBLIC";
  await course.save();
  let newCoursePromotion = new CoursePromotion();
  newCoursePromotion.fromCourse = courseId;
  await newCoursePromotion
    .save()
    .then(async (result) => {
      let promotion = { promotion: result._id };
      await Courses.findByIdAndUpdate(courseId, promotion);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  let reviewCourse = new ReviewCourse({ fromCourse: courseId });
  // let courseForum = new CourseForums({ fromCourse: courseId });
  let revenueCourse = new RevenueCourse({
    fromCourse: courseId,
    fromLecturerList: course.courseCreators,
  });
  await revenueCourse.save();
  await reviewCourse.save();
  // await courseForum.save();
  res.status(201).json({ message: "Course published" });
};
const updateCourseInfo = async (req, res, next) => {
  let course = req.course;
  let { courseName, description, category, subCategory } = req.body;
  course.courseName = courseName;
  course.description = description;
  course.category.mainCategory = category;
  course.category.subCategory = subCategory;
  await course.save();
  res.status(201).json({ message: "Course updated" });
};
const updateCoursePricing = async (req, res, next) => {
  let course = req.course;
  let { price } = req.body;
  course.price = Number(price);
  await course.save();
  res.status(201).json({ message: "Course price updated" });
};
const getCourseByLecturer = async (req, res, next) => {
  const { keyword } = req.query;
  let { lecId } = req.value.params;
  let courses;
  if (keyword) {
    const regex = new RegExp(escapeRegex(keyword), "gi");
    courses = await Courses.find({ courseName: regex, courseCreators: lecId })
      .select(
        "_id courseName price thumbnail description category approvalStatus"
      )
      .populate("category.mainCategory", "category subCategoryList");
    res.status(201).json(courses);
  } else {
    courses = await Courses.find({ courseCreators: lecId })
      .select(
        "_id courseName price thumbnail description category approvalStatus"
      )
      .populate("category.mainCategory", "category subCategoryList");
    res.status(201).json(courses);
  }
};
const submitCourseToReview = async (req, res, next) => {
  let course = req.course;
  course.approvalStatus = "PROCESSING";
  await course.save();
  res.status(201).json({ message: "Your course has been sent for approval" });
};
const deleteCourse = async (req, res, next) => {
  let course = req.course;
  let check1 = course.thumbnail;
  let check2 = course.previewVid;
  let prefix = "Courses/" + course.courseName;
  if (check1.imgUrl !== null || check2.vidUrl !== null) {
    await cloudUploader.cloudinary.api.delete_resources_by_prefix(
      `${prefix}/`,
      { resource_type: "image" }
    );
    await cloudUploader.cloudinary.api.delete_resources_by_prefix(
      `${prefix}/`,
      { resource_type: "video" }
    );
    await course.remove();
    res.status(201).json({ message: "Course deleted" });
  } else {
    await course.remove();
    res.status(201).json({ message: "Course deleted" });
  }
};
module.exports = {
  addCoCreator,
  addCourseGoals,
  addCourseRequirements,
  addCourseThumbnail,
  addCoursePreviewVid,
  createCourse,
  deactivateCourse,
  getOneCourse,
  getCourseDetail,
  getCourseByKeyWord,
  getCourseUnderApproval,
  getCourseByLecturer,
  index,
  publishCourse,
  updateCourseInfo,
  updateCoursePricing,
  submitCourseToReview,
  deleteCourse,
};
