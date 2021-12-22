const mongoose = require("mongoose");
const courseForumSchema = new mongoose.Schema({
  fromCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
  postArr: [
    {
      createAt: { type: Date },
      postTitle: { type: String },
      postContent: { type: String },
      creator: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      replyArr: [
        {
          replyAt: { type: String },
          message: { type: String },
          replier: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        },
      ],
    },
  ],
});

const CourseForum = mongoose.model("CourseForum", courseForumSchema);
module.exports = CourseForum;
