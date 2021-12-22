const WatchingHistory = require("../model/watchingHistory");

const getOneWatchingHistory = async (req, res, next) => {
  let { userId } = req.value.params;
  let { fromCourse } = req.body;
  let watchingHistory = await WatchingHistory.findOne({ viewer: userId });
  let historyElement = watchingHistory.listWatchingHistory.find(
    (element) => element.fromCourse.toString() === fromCourse
  );
  req.watchingHistory = watchingHistory;
  req.historyElement = historyElement;
  next();
};

const getWatchingHistory = async (req, res, next) => {
  let { userId } = req.value.params;
  let watchingHistory = await WatchingHistory.findOne({ viewer: userId });
  res.status(201).json(watchingHistory);
};

const saveWatchingHistory = async (req, res, next) => {
  let { fromCourse, urlVideo, stopTime } = req.body;
  let watchingHistory = req.watchingHistory;
  let historyElement = req.historyElement;
  if (historyElement) {
    historyElement.watchedDate = new Date();
    historyElement.urlVideo = urlVideo;
    historyElement.stopTime = stopTime;
    await watchingHistory.save();
    res.status(201).json({ message: "Your watching history has been save" });
  } else {
    let watchedDate = new Date();
    watchingHistory.listWatchingHistory.push({
      fromCourse,
      watchedDate,
      urlVideo,
      stopTime,
    });
    await watchingHistory.save();
    res.status(201).json({ message: "Your watching history has been save" });
  }
};

module.exports = {
  getOneWatchingHistory,
  getWatchingHistory,
  saveWatchingHistory,
};
