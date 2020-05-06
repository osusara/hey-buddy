const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const Dare = require("../../models/Dare");

// @route   POST api/post
// @desc    Create a post
// @access  Private
router.post("/user/:user_id", auth, async (req, res) => {
  try {

    // get sender
    const sender = await User.findById(req.user.id).select('-password');

    // get receiver prfoile
    const receiver = await Profile.findOne({$and: [
        { user: req.params.user_id },
        { $or: [{ privacy: false }, { buddies: { $elemMatch: { user: req.params.user_id } } }] },
      ],
    }).populate("user", ["username, active"]);

    // get sender profile
    const profile = await Profile.findOne({ user: req.user.id});

    // get a random dare
    const dare = await Dare.findOne().skip(
      Math.floor(Math.random() * Dare.count())
    );

    const newPost = new Post({
      sender: {
        user: req.user.id,
        name: profile.name,
        text: req.body.text,
      },
      dare: dare._id,

      // have to add receiver
    });

    const post = await newPost.save()
    res.json(post);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

module.exports = router;
