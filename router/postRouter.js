const express = require("express");
const router = express.Router();
const users = require("../models/users");
const posts = require("../models/post");

// View all Post

// Create post
router.post("/create", async (req, res) => {
  try {
    const post = new posts(req.body);
    const savedPost = await post.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Update Post
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await posts.findByIdAndUpdate(id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post is Updated");
    } else {
      res.status(402).json("You can only update your  post");
    }
  } catch {
    res.status(500).json(err);
  }
});

// Delete a post

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await posts.findById(id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted");
    } else {
      res.status(403).json("You cannot delete a post that isn't yours");
    }
  } catch (error) {}
});

// Like & UnLike
router.put("/:id/like", async (req, res) => {
  try {
    const post = await posts.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });

      res.status(200).json("You like this post ");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });

      res.status(200).json("You dislike this post ");
    }
  } catch {
    res.json(err.message);
  }
});

// Get post timeline

router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await users.findById(req.body.userId);
    const userPosts = await posts.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followers.map((friendId) => {
        return posts.find({ userId: friendId });
      }),
    );
    res.json(
      userPosts
        .concat(...friendPosts)
        .sort((a, b) => b.createdAt - a.createdAt),
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
