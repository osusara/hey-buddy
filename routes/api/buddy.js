const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require('../../middleware/auth');
const activationCheck = require('../../middleware/activationCheck');
const activeCheck = require('../../functions/activeCheck');
const Buddy = require('../../models/Buddy');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await  Profile.findOne({ user: req.user.id }).populate('user', ['userename', 'active', 'date']);
    if(!profile) {
      return res.status(400).json({ msg: 'Your profile is not set' });
    }

    res.json(profile);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   POST api/buddy
// @desc    Create or update buddy
// @access  Private
router.post('/', [auth, activationCheck], async (req, res) => {
  try {
    if( req.user.id.toString() === req.body.buddy )
      return res.status(400).json({ msg: "You can't add your self as a buddy!" });

    let youBuddy = await Buddy.findOne({ user: req.user.id });
    
    if (!youBuddy)
      youBuddy = new Buddy({ user: req.user.id });

    if(youBuddy.buddies.some((buddy) => buddy.user.toString() === req.body.buddy))
      return res.status(400).json({ msg: 'Already a buddy' });
    
    youBuddy.buddies.unshift({ user: req.body.buddy });

    await youBuddy.save();
    res.json(youBuddy);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
 
});

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', [auth, activationCheck], async (req, res) => {
  try {
    const profiles = await Profile.find({ $and: [{ active: true }, { privacy: false }] })
      .populate("user", ["username, active"]);

    res.json(profiles);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get('/user/:user_id', [auth, activationCheck], async (req, res) => {
  try {
    activeCheck(req, res);

    // if user is active check the profile
    const profile = await Profile.findOne({
      $and: [
        { user: req.params.user_id },
        { $or: [{ privacy: false }, { buddies: { $elemMatch: { user: req.params.user_id } } }] },
      ],
    }).populate("user", ["username, active"]);

    if(!profile)
      return res.status(400).json({ msg: 'This profile is private or not set' });

    res.json(profile);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);

    if(error.kind == 'ObjectId')
      return res.status(400).json({ msg: "Profile is not available" });

    res.status(500).send("Server error");
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user & posts permanently
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // @todo remove user and posts

    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted permenently' });

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
})

module.exports = router;
