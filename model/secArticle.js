const mongoose = require("mongoose");
const secArticlesSchema = new mongoose.Schema({
  articleContent: { type: String },
});
const SecArticles = mongoose.model("SecArticles", secArticlesSchema);
module.exports = SecArticles;
