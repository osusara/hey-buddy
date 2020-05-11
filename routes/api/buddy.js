const express = require("express");
const router = express.Router();

const auth = require('../../middleware/auth');
const activationCheck = require('../../middleware/activationCheck');
const activeCheck = require('../utils/activeCheck');
const privacyCheck = require('../utils/privacyCheck');
const buddyCheck = require('../utils/buddyCheck');
const Buddy = require('../../models/Buddy');

// @route   GET api/buddy/me
// @desc    Get current user's buddies
// @access  Private
router.get("/me", [auth, activationCheck], async (req, res) => {
  try {
    const youBuddy = await Buddy.findOne({ user: req.user.id });

    if (!youBuddy || youBuddy.buddies.length === 0)
      return res.status(400).json({ msg: "You have no buddy yet" });

    res.json(youBuddy);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   POST api/buddy
// @desc    Add buddy
// @access  Private
router.post('/', [auth, activationCheck], async (req, res) => {
  try {
    if( req.user.id.toString() === req.body.buddy )
      return res.status(400).json({ msg: "You can't add your self as a buddy!" });

    let youBuddy = await Buddy.findOne({ user: req.user.id });
    
    if (!youBuddy)
      youBuddy = new Buddy({ user: req.user.id });

    if(youBuddy.buddies.some( async buddy => buddy.user.toString() === req.body.buddy)){
      return res.status(400).json({ msg: 'User already your buddy' });
    }
    
    youBuddy.buddies.unshift({ user: req.body.buddy });

    await youBuddy.save();
    res.json(youBuddy);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
 
});

// @route   GET api/buddy/:user_id
// @desc    Get buddies by user id
// @access  Private
router.get('/:user_id', [auth, activationCheck], async (req, res) => {
  try {
    // check if the user is active
    activeCheck(req, res);
    
    // check if the user is private or not a buddy
    if(await privacyCheck(req.params.user_id, req, res) && !(await buddyCheck(req.params.user_id, req, res)))
      return res.status(401).json({ msg: "User is private" });

    // if user is active check the profile
    const buddy = await Buddy.findOne({ user: req.params.user_id });

    if (!buddy || buddy.buddies.length === 0)
      return res.status(404).json({ msg: "User haven't any buddy" });

    res.json(buddy);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);

    if(error.kind == 'ObjectId')
      return res.status(400).json({ msg: "User is not available" });

    res.status(500).send("Server error");
  }
});

// @route   PUT api/buddy/:user_id
// @desc    Remove buddy
// @access  Private
router.put('/:user_id', [auth, activationCheck], async (req, res) => {
  try {
    let youBuddy = await Buddy.findOne({ user: req.user.id });

    if(youBuddy.buddies.filter(buddy => buddy.user.toString() === req.params.user_id).length === 0)
      return res.status(400).json({ msg: 'User already not your buddy' });

    const removeIndex = youBuddy.buddies
      .map((buddy) => buddy.user.toString())
      .indexOf(req.params.user_id);

    youBuddy.buddies.splice(removeIndex, 1);

    await youBuddy.save();
    res.json(youBuddy);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
})

// @route   PUT api/buddy/special/:user_id
// @desc    Make buddy special/unspecial
// @access  Private
router.put('/special/:user_id', [auth, activationCheck], async (req, res) => {
  try {
    let youBuddy = await Buddy.findOne({ user: req.user.id });

    if(youBuddy.buddies.filter(buddy => buddy.user.toString() === req.params.user_id).length === 0)
      return res.status(400).json({ msg: 'User is not your buddy' });

    youBuddy.buddies.map(async buddy => {
      if(buddy.user.toString() === req.params.user_id)
        buddy.special = !buddy.special;
    });

    await youBuddy.save();
    return res.json(youBuddy);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
})

module.exports = router;
