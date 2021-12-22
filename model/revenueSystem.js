const mongoose = require("mongoose");
const revenueSystemSchema = new mongoose.Schema(
  {
    fromCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
    courseFee: { type: Number },
  },
  {
    timestamps: true,
  }
);

const RevenueSystem = mongoose.model("RevenueSystem", revenueSystemSchema);
module.exports = RevenueSystem;
