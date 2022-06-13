const { request } = require("express");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const users = require("../models/users");

// Create Account
router.post("/register", async (req, res) => {
  try {
    const { email, username } = req.body;
    const matchUsername = await users.findOne({ username });
    const matchEmail = await users.findOne({ email });
    if (matchUsername) {
      return res.json({ err: "Username is taken choose another username" });
    }
    if (matchEmail) {
      return res.json({ err: "Email already used" });
    }

    const salt = 10;
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = new users({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    const saveUser = await user.save();

    res.json(saveUser);
  } catch (err) {
    res.json(err.message);
  }
});
// Login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await users.findOne({ email });
    if (!user) {
      return res.json({ err: "No account found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ err: "Wrong Password" });
    }

    res.json(user);
  } catch (err) {
    res.json(err.message);
  }
});

// Update User
router.put("/:id", async (req, res) => {
  try {
    const UpdateUser = await users.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(UpdateUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Follow a User
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await users.findById(req.params.id);
      const currentUser = await users.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cannot follow yourself");
  }
});
// Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await users.findById(req.params.id);
      const currentUser = await users.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { following: req.body.userId } }); // People you are following
        await currentUser.updateOne({ $pull: { followers: req.params.id } }); // People Following you
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You already unfollow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cannot ufollow yourself");
  }
});

module.exports = router;
