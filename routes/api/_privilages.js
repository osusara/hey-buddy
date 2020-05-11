const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const _auth = require("../../middleware/_auth");
const _activationCheck = require("../../middleware/_activationCheck");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const Challenge = require("../../models/Challenge");
const User = require("../../models/User");

// @route   DELETE api/user/:user_id
// @desc    Delete profile, user & posts permanently
// @access  Private
router.delete("/:user_id", [_auth, _activationCheck], async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.params.user_id });
    await User.findOneAndRemove({ _id: req.params.user_id });
    await Post.deleteMany({ user: req.params.user_id });
    await Challenge.deleteMany({ 'sender.user': req.params.user_id });

    res.json({ msg: "User deleted permenently" });
    
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

module.exports = router;
