const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require('../../middleware/auth');
const activationCheck = require('../../middleware/activationCheck');
const activeCheck = require('../utils/activeCheck');
const Profile = require('../../models/Profile');
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

// @route   POST api/profile
// @desc    Create or update profile
// @access  Private
router.post('/', [auth, activationCheck], async (req, res) => {
  const { name, image, bio, gender, relationship, address, interests, score, facebook, twitter, instagram, youtube, privacy } = req.body;

  // build profile object
  const profileFields = {}
  profileFields.user = req.user.id;
  if (name) profileFields.name = name;
  if (image) profileFields.image = image;
  if (bio) profileFields.bio = bio;
  if (gender) profileFields.gender = gender;
  if (relationship) profileFields.relationship = relationship;
  if (address) profileFields.address = address;
  if (privacy) profileFields.privacy = privacy;
  if (interests) profileFields.interests = interests.split(',').map(interest => interest.trim());
  if (score) profileFields.score = score;
  
  // build social object
  profileFields.social = {}
  if (facebook) profileFields.social.facebook = facebook;
  if (twitter) profileFields.social.twitter = twitter;
  if (instagram) profileFields.social.instagram = instagram;
  if (youtube) profileFields.social.youtube = youtube;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if(profile) {
      profileFields.score = profile.score;
      
      // update profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }

    // create profile
    profile = new Profile(profileFields);

    await profile.save();
    res.json(profile);

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

module.exports = router;
