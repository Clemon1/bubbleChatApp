const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    photo: {
      type: String,
      default: "no Photo",
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

const posts = mongoose.model("posts", postSchema);
module.exports = posts;
