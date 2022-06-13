const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      min: 3,
      max: 20,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 50,
    },
    profilePic: {
      type: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const users = mongoose.model("Users", userSchema);

module.exports = users;
