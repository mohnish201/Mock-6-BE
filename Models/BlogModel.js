const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    username: String,
    title: String,
    content: String,
    category: String,
    date: String,
    likes: Number,
    comments: [Object],
    userId: String,
    user: String
  },
  {
    versionKey: false,
  }
);

const BlogModel = mongoose.model("blog", BlogSchema);

module.exports = {
  BlogModel,
};
