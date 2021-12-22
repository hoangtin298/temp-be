require("dotenv").config();

const express = require("express");
// const io = require("socket.io");
const app = express();
const http = require("http");
const server = http.createServer(app);

const cors = require("cors");
require("./db/connection");
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const userRouter = require("./routes/user.r");
const categoryRouter = require("./routes/category.r");
const courseRouter = require("./routes/course.r");
const reviewcourseRouter = require("./routes/reviewcourse.r");
const courseForumRouter = require("./routes/courseForum.r");
const revenueSystemRouter = require("./routes/revenueSystem.r");
const sectionRouter = require("./routes/section.r");
const shoppingcartRouter = require("./routes/shoppingcart.r");
const subcribecourseRouter = require("./routes/subcribecourse.r");
const onlineteachingRouter = require("./routes/onlineteaching.r");
const coursePromotionRouter = require("./routes/coursepromotion.r");
const onlineLearningRouter = require("./routes/onlineLearning.r");
const courseRevenue = require("./routes/revenueCourse.r");
app.use("/api/ManageUser", userRouter);
app.use("/api/ManageCategory", categoryRouter);
app.use("/api/ManageCourse", courseRouter);
app.use("/api/ReviewCourse", reviewcourseRouter);
app.use("/api/CourseForum", courseForumRouter);
app.use("/api/RevenueSystem", revenueSystemRouter);
app.use("/api/ManageCourseSection", sectionRouter);
app.use("/api/ShoppingCart", shoppingcartRouter);
app.use("/api/SubscribeCourse", subcribecourseRouter);
app.use("/api/OnlineTeaching", onlineteachingRouter);
app.use("/api/CoursePromotion", coursePromotionRouter);
app.use("/api/OnlineLearning", onlineLearningRouter);
app.use("/api/CourseRevenue", courseRevenue);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
app.io = io;
require("./middleware/helpChatBox")(app);

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Server is OK!",
  });
});
// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});
// Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("✅ Server is running"));
