const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const _auth = require("../../middleware/_auth");
const _activationCheck = require("../../middleware/_activationCheck");
const Dare = require("../../models/Dare");

// @route   POST api/dare
// @desc    Create a dare
// @access  Private
router.post("/", [_auth, _activationCheck, [
  check('title', "Title can't be empty").not().isEmpty(),
  check('text', "Text can't be empty").not().isEmpty(),
  check('type', "Type can't be empty").not().isEmpty(),
  check('level', "Level can't be empty").not().isEmpty(),
]], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const newDare = new Dare({
    title: req.body.title,
    text: req.body.text,
    type: req.body.type,
    level: req.body.level,
    tags: req.body.tags.toString().split(',').map(skill => skill.trim()),
    author: req.admin.id,
  });

  try {
    const dare = await newDare.save();
    res.json(dare);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   GET api/dare
// @desc    Get all dares
// @access  Private
router.get("/", [_auth, _activationCheck], async (req, res) => {
  try {
    const dares = await Dare.find();
    res.json(dares);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   GET api/dare/me
// @desc    Get my dares
// @access  Private
router.get("/me", [_auth, _activationCheck], async (req, res) => {
  try {
    const dares = await Dare.find({ author: req.admin.id }).sort({ date: -1 });
    res.json(dares);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   GET api/dare/:dare_id
// @desc    Get dare by id
// @access  Private
router.get("/:dare_id", [_auth, _activationCheck], async (req, res) => {
  try {
    const dare = await Dare.findById(req.params.dare_id);
    if (!dare) return res.status(404).json({ msg: "Dare not found" });

    res.json(dare);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);

    if (error.kind === "ObjectId")
      return res.status(404).json({ msg: "Dare not found" });

    res.status(500).send("Server error");
  }
});

// @route   PUT api/dare/:dare_id
// @desc    Update a dare
// @access  Private
router.put("/:dare_id", [_auth, _activationCheck, [
  check('title', "Title can't be empty").not().isEmpty(),
  check('text', "Text can't be empty").not().isEmpty(),
  check('type', "Type can't be empty").not().isEmpty(),
  check('level', "Level can't be empty").not().isEmpty(),
]], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const updatedDare = {
    title: req.body.title,
    text: req.body.text,
    type: req.body.type,
    level: req.body.level,
    tags: req.body.tags.toString().split(',').map(skill => skill.trim()),
    author: req.admin.id,
  };

  try {
    let dare = await Dare.findById(req.params.dare_id);

    if(!dare)
      return res.status(404).json({ msg: 'Dare not found' });
    
    dare = await Dare.findOneAndUpdate(
      { _id: req.params.dare_id },
      { $set: updatedDare },
      { new: true }
    );

    res.json(dare);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/dare/:dare_id
// @desc    Delete a dare
// @access  Private
router.delete("/:dare_id", [_auth, _activationCheck], async (req, res) => {
  try {
    const dare = await Dare.findById(req.params.dare_id);

    if (!dare)
      return res.status(404).json({ msg: "Dare not found" });

    if (dare.author.toString() !== req.admin.id)
      return res.status(401).json({ msg: "User not authorized" });

    await dare.remove();
    res.json({ msg: "Dare removed" });

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);

    if (error.kind === "ObjectId")
      return res.status(404).json({ msg: "Dare not found" });

    res.status(500).send("Server error");
  }
});

module.exports = router;
