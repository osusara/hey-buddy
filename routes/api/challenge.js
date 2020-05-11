const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");

const auth = require("../../middleware/auth");
const activationCheck = require("../../middleware/activationCheck");
const buddyCheck = require("../utils/buddyCheck");
const privacyCheck = require("../utils/privacyCheck");
const activeCheck = require("../utils/activeCheck");
const Profile = require("../../models/Profile");
const Buddy = require("../../models/Buddy");
const Challenge = require("../../models/Challenge");
const Dare = require("../../models/Dare");

// @route   POST api/challenge
// @desc    Create a challenge
// @access  Private
router.post("/", [auth, activationCheck], async (req, res) => {
  try {
    // get a random dare
    const dare = await Dare.aggregate([{ $sample: {size: 1}}]);
    
    let receivers = [];
    req.body.receivers.split(",").map(async receiver => {
      // if (!await privacyCheck(ObjectId(receiver), req, res) || await buddyCheck(ObjectId(receiver), req, res))
        receivers.unshift({ user: receiver });
    });

    const newChallenge = new Challenge({
      sender: {
        user: req.user.id,
        name: req.user.id,
        text: req.body.text,
      },
      dare: dare[0]._id,
      receivers: receivers,
    });

    await newChallenge.save()
    res.json(newChallenge);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   GET api/challenge
// @desc    Get buddies challenges
// @access  Private
router.get("/", [auth, activationCheck], async (req, res) => {
  try {
    const youBuddy = await Buddy.findOne({ user: req.user.id });

    if(!youBuddy)
      return res.status(404).json({ msg: "User not found" });

    let buddies = [];
    youBuddy.buddies.map((buddy) => {
      buddies.unshift(buddy.user);
    });

    const challenges = await Challenge
      .find({ 'sender.user': { $in: buddies } })
      .sort({ date: -1 }).limit(20);

    res.json(challenges);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   GET api/challenge/me
// @desc    Get my challenges
// @access  Private
router.get('/me', [auth, activationCheck], async (req, res) => {
  try {    
    const challenges = await Challenge
      .find({ 'sender.user': req.user.id })
      .sort({ date: -1 }).limit(20);

    res.json(challenges);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   GET api/challenge/:challenge_id
// @desc    Get challenge by id
// @access  Private
router.get('/:challenge_id', [auth, activationCheck], async (req, res) => {
  try {    
    const challenge = await Challenge.findById(req.params.challenge_id);

    if(!challenge)
      return res.status(404).json({ msg: 'Challenge not found' });

    if(await privacyCheck(challenge.sender.user, req, res) && !(await buddyCheck(challenge.sender.user, req, res)))
      return res.status(401).json({ msg: 'User is private' });

    res.json(challenge);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);

    if (error.kind === 'ObjectId')
      return res.status(404).json({ msg: "Challenge not found" });

    res.status(500).send("Server error");
  }
});

// @route   DELETE api/challenge/:challenge_id
// @desc    Delete a challenge
// @access  Private
router.delete('/:challenge_id', [auth, activationCheck], async (req, res) => {
  try {    
    const challenge = await Challenge.findById(req.params.challenge_id);

    if(!challenge)
      return res.status(404).json({ msg: 'Challenge not found' });

    if(challenge.sender.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'User not authorized' });

    await challenge.remove();
    res.json({ msg: 'Challenge removed' });

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);

    if (error.kind === "ObjectId")
      return res.status(404).json({ msg: "Challenge not found" });

    res.status(500).send("Server error");
  }
});

// @route   PUT api/challenge/:challenge_id
// @desc    Close/unclose a challenge
// @access  Private
router.put("/:challenge_id", [auth, activationCheck], async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.challenge_id);

    if(challenge.sender.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'This challenge is not yours' });
      
    challenge.close = !challenge.close;

    await challenge.save();
    res.json(challenge);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

module.exports = router;
