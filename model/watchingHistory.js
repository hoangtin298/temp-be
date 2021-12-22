const mongoose = require("mongoose");
const watchingHistorySchema = new mongoose.Schema({
  viewer: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  listWatchingHistory: [
    {
      fromCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
      watchedDate: { type: Date },
      urlVideo: { type: String },
      stopTime: { type: Number },
    },
  ],
});

const WatchingHistory = mongoose.model(
  "WatchingHistory",
  watchingHistorySchema
);
module.exports = WatchingHistory;
