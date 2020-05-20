const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");

const auth = require("../../middleware/auth");
const activationCheck = require("../../middleware/activationCheck");
const buddyCheck = require("../utils/buddyCheck");
const privacyCheck = require("../utils/privacyCheck");
const addScore = require("../utils/addScore");
const Profile = require("../../models/Profile");
const Buddy = require("../../models/Buddy");
const Post = require("../../models/Post");
const Dare = require("../../models/Dare");

// @route   POST api/post
// @desc    Create a post
// @access  Private
router.post("/", [auth, activationCheck, [
  check('title', 'Title can not be empty').not().isEmpty(),
  check('text', 'Post text can not be empty').not().isEmpty(),
  check('level', 'Level can not be empty').not().isEmpty(),
  check('tags', 'Must include atleast one tag empty').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array });

  try {

    const { title, text, level, tags, create } = req.body;

    
    const newPost = new Post({
      user: req.user.id,
      name: req.user.name,
      title,
      text,
      level,
      tags: tags.split(",").map((tag) => tag.trim()),
    });
    
    if (create) {
      const newDare = new Dare({
        title,
        text,
        level,
        type: "user",
        tags: req.body.tags.toString().split(',').map(tag => tag.trim()),
        author: req.user.id,
      });

      await newDare.save();
    }


    await addScore(req.user.id, 5, req, res);

    const post = await newPost.save();
    res.json(post);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   GET api/post
// @desc    Get buddies posts
// @access  Private
router.get("/", [auth, activationCheck], async (req, res) => {
  try {
    const youBuddy = await Buddy.findOne({ user: req.user.id });

    if (!youBuddy) return res.status(404).json({ msg: "User not found" });

    let buddies = [];
    youBuddy.buddies.map((buddy) => {
      buddies.unshift(buddy.user);
    });

    const posts = await Post
      .find({ user: { $in: buddies } })
      .sort({ date: -1 }).limit(20);

    res.json(posts);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   GET api/post/me
// @desc    Get my posts
// @access  Private
router.get("/me", [auth, activationCheck], async (req, res) => {
  try {
    const posts = await Post
      .find({ user: req.user.id })
      .sort({ date: -1 }).limit(20);

    res.json(posts);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   GET api/post/:post_id
// @desc    Get post by id
// @access  Private
router.get("/:post_id", [auth, activationCheck], async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    if ((await privacyCheck(post.user, req, res)) && !(await buddyCheck(post.user, req, res)))
      return res.status(401).json({ msg: "User is private" });

    res.json(post);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);

    if (error.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });

    res.status(500).send("Server error");
  }
});

// @route   GET api/post/explore
// @desc    Explore posts
// @access  Private
router.get("/explore", [auth, activationCheck], async (req, res) => {
  try {


    res.json("OKay");

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/post/:post_id
// @desc    Delete a post
// @access  Private
router.delete("/:post_id", [auth, activationCheck], async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    await addScore(req.user.id, -5, req, res);

    await post.remove();
    res.json({ msg: "Post removed" });

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);

    if (error.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });

    res.status(500).send("Server error");
  }
});

// @route   PUT api/post/like/:post_id
// @desc    Highfive a post
// @access  Private
router.put("/like/:post_id", [auth, activationCheck], async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post)
      return res.status(404).send("Post not found");

    // check if already high fived
    if (post.highfives.filter(highfive => highfive.user.toString() === req.user.id).length > 0)
      return res.status(400).json({ msg: "Post has already been high fived" });

    post.highfives.unshift({
      user: req.user.id,
      name: req.user.name,
    });

    await addScore(req.user.id, 1, req, res);

    await post.save();
    res.json(post.highfives);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/post/unlike/:post_id
// @desc    Remove highfive from a post
// @access  Private
router.put("/unlike/:post_id", [auth, activationCheck], async (req, res) => {
    try {
      const post = await Post.findById(req.params.post_id);

      if (!post)
        return res.status(404).send("Post not found");

      // check if post is not high fived
      if (post.highfives.filter(highfive => highfive.user.toString() === req.user.id).length === 0)
        return res.status(400).json({ msg: "Post has not yet been highfived" });

      // get remove index
      const removeIndex = post.highfives
        .map(highfive => highfive.user.toString())
        .indexOf(req.user.id);

      post.highfives.splice(removeIndex, 1);

      await addScore(req.user.id, -1, req, res);

      await post.save();
      res.json(post.highfives);

    } catch (error) {
      console.log(`Error: ${error.message}`.red.bold);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT api/post/reply/:post_id
// @desc    Reply a post
// @access  Private
router.put("/reply/:post_id", [auth, activationCheck, [
    check("text", "Text can not be empty").not().isEmpty()
  ]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array });

    try {
      const post = await Post.findById(req.params.post_id);

      if(!post)
        return res.status(404).json({ msg: 'Post not found' });

      if(post.close)
        return res.status(200).json({ msg: "Post has been closed" });

      const newReply = {
        user: req.user.id,
        text: req.body.text,
        name: req.user.name
      }

      post.replies.unshift(newReply);

      await post.save();
      res.json(post.replies);

    } catch (error) {
      console.log(`Error: ${error.message}`.red.bold);
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/post/reply/:post_id/:reply_id
// @desc    Delete a reply
// @access  Private
router.delete("/reply/:post_id/:reply_id", [auth, activationCheck], async (req, res) => {
    try {
      const post = await Post.findById(req.params.post_id);

      if(!post)
        return res.status(404).json({ msg: 'Post not found' });

      const reply = post.replies.find(reply => reply.id === req.params.reply_id);

      if (!reply)
        return res.status(404).json({ msg: "Reply does not exist" });

      if (reply.user.toString() !== req.user.id)
        return res.status(401).json({ msg: "User not authorized" });

      const removeIndex = post.replies
        .map(reply => reply.user.toString())
        .indexOf(req.user.id);

      post.replies.splice(removeIndex, 1);
      await post.save();

      res.json(post.replies);
    } catch (error) {
      console.log(`Error: ${error.message}`.red.bold);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT api/post/reply/:post_id/:reply_id
// @desc    Mark reply as done
// @access  Private
router.put("/reply/:post_id/:reply_id", [auth, activationCheck], async (req, res) => {
    try {
      const post = await Post.findById(req.params.post_id);

      if(!post)
        return res.status(404).json({ msg: 'Post not found' });
        
      if (post.user.toString() !== req.user.id)
         return res.status(401).json({ msg: "User not authorized" });

      const reply = post.replies.find(reply => reply.id === req.params.reply_id);

      if (!reply)
        return res.status(404).json({ msg: "Reply does not exist" });

      if (reply.done)
        return res.status(400).json({ msg: 'Reply already marked as done' });

      reply.done = true;

      await addScore(reply.user, 10, req, res);

      await post.save();
      res.json(post.replies);

    } catch (error) {
      console.log(`Error: ${error.message}`.red.bold);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT api/post/:post_id
// @desc    Close/reopen a post
// @access  Private
router.put("/:post_id", [auth, activationCheck], async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post)
      return res.status(404).send("Post not found");

    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    post.close = !post.close;

    await post.save();
    res.json(post);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

module.exports = router;
