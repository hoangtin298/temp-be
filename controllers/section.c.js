const Sections = require("../model/section");
const Courses = require("../model/course");
const SecVideoLecture = require("../model/secVideoLecture");
const SecArticle = require("../model/secArticle");
const { getVideoDurationInSeconds } = require("get-video-duration");
const fs = require("fs");
const cloudUploader = require("../config/cloudConfig");
//SUB
const getSection = async (req, res, next) => {
  let section;
  const { sectionID } = req.value.params;
  section = await Sections.findById(sectionID);
  if (!section) {
    return res.status(404).json({ message: "Section not found" });
  } else {
    req.section = section;
    next();
  }
};
const getLecture = async (req, res, next) => {
  let section = req.section;
  const { lectureID } = req.value.params;
  let thisLecture = await section.listLecture.find(
    (lecture) => lecture._id.toString() === lectureID
  );
  if (!thisLecture) {
    return res.status(404).json({ message: "Lecture not found" });
  } else {
    req.lecture = thisLecture;
    next();
  }
};
const getCourseBySection = async (req, res, next) => {
  let section = req.section;
  let course;
  course = await Courses.findById(section.fromCourse);
  if (!course) {
    throw new Error("Course not found");
  } else {
    course = req.course;
    next();
  }
};
//Handle API
const activeSection = async (req, res, next) => {
  let section = req.section;
  section.publishStatus = true;
  await section.save();
  res.status(201).json({ message: "Section activated" });
};
const addSection = async (req, res, next) => {
  let courseID = req.body.fromCourse;
  let newSection = new Sections(req.body);
  let course = await Courses.findById(courseID);
  await newSection
    .save()
    .then((result) => {
      course.courseSections.push(result._id);
      course.save();
    })
    .catch((err) => {
      throw new Error(err);
    });
  res.status(201).json(newSection);
};

const addLecture = async (req, res, next) => {
  let section = req.section;
  let lectureName = req.body.lectureName;
  section.listLecture.push({ lectureName });
  await section.save();
  res.status(201).json({ message: "Lecture added" });
};
const addLectureArticle = async (req, res, next) => {
  let section = req.section;
  let lecture = req.lecture;
  let { articleContent } = req.body;
  let lectureArticle = new SecArticle({
    articleContent: articleContent,
  });
  await lectureArticle.save();
  lecture.lectureType = "ARTICLE";
  lecture.contentArticle = lectureArticle._id;
  section.countSection.article = Number(section.countSection.article) + 1;
  await section.save();
  res.status(201).json({ message: "Article added" });
};

const addLectureVid = async (req, res, next) => {
  let section = req.section;
  let lecture = req.lecture;
  if (req.files[0]) {
    const fileName = req.files[0].filename.split(".")[0];
    const localPath = req.files[0].path;
    const folderCloud = `Courses/video/${fileName}`;
    cloudUploader.cloudinary.uploader.upload(
      localPath,
      {
        resource_type: "video",
        public_id: folderCloud,
        chunk_size: 10000000,
      },
      async (err, result) => {
        if (err) {
          fs.unlinkSync(localPath);
          return res.json({ message: "Fail to upload" });
        } else {
          getVideoDurationInSeconds(localPath).then(async (duration) => {
            fs.unlinkSync(localPath);
            let min = Math.floor(duration / 60);
            let sec = Math.floor(duration - min * 60);
            let newSecVid = new SecVideoLecture({
              videoUrl: result.url,
              minPerVid: min,
              secPerVid: sec,
            });
            await newSecVid.save();
            lecture.lectureType = "VIDEO";
            lecture.contentVideo = newSecVid._id;
            section.countSection.video = Number(section.countSection.video) + 1;
            await section.save();
            return res.json({ message: "Uploaded" });
          });
        }
      }
    );
  }
};

const delLecture = async (req, res, next) => {
  let section = req.section;
  let lecture = req.lecture;
  let article = lecture.contentArticle;
  let video = lecture.contentVideo;
  if (video) {
    section.listLecture.pull({ _id: session._id });
    section.countSection.video = Number(section.countSection.video) - 1;
    await section.save();
    res.status(201).json({ message: "Lecture deleted" });
  } else if (article) {
    section.listLecture.pull({ _id: session._id });
    section.countSection.article = Number(section.countSection.article) - 1;
    await section.save();
    res.status(201).json({ message: "Lecture deleted" });
  } else {
    section.listLecture.pull({ _id: session._id });
    await section.save();
    res.status(201).json({ message: "Lecture deleted" });
  }
};

const delSection = async (req, res, next) => {
  let section = req.section;
  let secId = section._id.toString();
  let course = req.course;
  await section.remove();
  course.courseSections = course.courseSections.filter(
    (item) => item.toString() !== secId
  );
  await course.save();
  res.status(201).json({ message: "Section deleted" });
};

const deactivateSection = async (req, res, next) => {
  let section = req.section;
  section.publishStatus = false;
  await section.save();
  res.status(201).json({ message: "Section deactivated" });
};
const modifyLecture = async (req, res, next) => {
  let section = req.section;
  let lecture = req.lecture;
  let { lectureName } = req.body;
  lecture.lectureName = lectureName;
  await section.save();
  res.status(201).json({ message: "Course lecture updated" });
};

const index = async (req, res, next) => {
  let sections = await Sections.find();
  res.status(201).json(sections);
};
const modifySection = async (req, res, next) => {
  let section = req.section;
  let { sectionTitle } = req.body;
  section.sectionTitle = sectionTitle;
  await section.save();
  res.status(201).json({ message: "Section title updated" });
};

const modifyLectureVideo = async (req, res, next) => {
  let lecture = req.lecture;
  let videoId = lecture.contentVideo;
  let thisVideo = await SecVideoLecture.findById(videoId);
  if (!thisVideo) {
    throw new Error("Lecture video not found");
  } else {
    if (req.files[0]) {
      const fileName = req.files[0].filename.split(".")[0];
      const localPath = req.files[0].path;
      const folderCloud = `Courses/video/${fileName}`;
      cloudUploader.cloudinary.uploader.upload(
        localPath,
        {
          resource_type: "video",
          public_id: folderCloud,
          chunk_size: 10000000,
        },
        async (err, result) => {
          if (err) {
            fs.unlinkSync(localPath);
            return res.json({ message: "Fail to upload" });
          } else {
            getVideoDurationInSeconds(localPath).then(async (duration) => {
              fs.unlinkSync(localPath);
              let min = Math.floor(duration / 60);
              let sec = Math.floor(duration - min * 60);
              thisVideo.videoUrl = result.url;
              thisVideo.minPerVid = min;
              thisVideo.secPerVid = sec;
              await thisVideo.save();
              return res.json({ message: "New video content updated" });
            });
          }
        }
      );
    }
  }
};
const modifyLectureArticle = async (req, res, next) => {
  let lecture = req.lecture;
  let articleId = lecture.contentArticle;
  let { articleContent } = req.body;
  let thisArticle = await SecArticle.findById(articleId);
  if (!thisArticle) {
    throw new Error("Article not found");
  } else {
    thisArticle.articleContent = articleContent;
    await thisArticle.save();
    res.status(201).json({ message: "Article updated" });
  }
};
const getSectionsByCourse = async (req, res, next) => {
  const { courseId } = req.value.params;
  let sectionsByCourse = await Sections.find({ fromCourse: courseId })
    .populate("listLecture.contentVideo", "-_id")
    .populate("listLecture.contentArticle", "-_id")
    .populate("listQuiz.contentQuiz", "-_id");
  res.status(201).json(sectionsByCourse);
};
module.exports = {
  index,
  activeSection,
  addSection,

  addLectureArticle,

  addLecture,
  addLectureVid,
  delSection,
  delLecture,

  deactivateSection,
  getCourseBySection,
  getSection,
  getLecture,

  getSectionsByCourse,
  modifySection,

  modifyLecture,
  modifyLectureVideo,
  modifyLectureArticle,
};
