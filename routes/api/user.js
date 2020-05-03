const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
dotenv.config({ path: "./config/config.env" });

// @route   POST api/user
// @desc    Register user
// @access  Public
router.post('/', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {

  // Check for validation errors
  const errors = validationResult(req);
  if(!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;

  try {
    // See if user is exist
    let user = await User.findOne({ email });

    if(user) {
      return res.status(400).json({ errors: [{
        msg: 'Email is already used by another user'
      }] });
    }

    // Encrypt password
    user = new User({
      username,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return JWT
    const payload = {
      user: { id: user.id }
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if(err) throw err;
      res.json({ token });
    });

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send('Server error')
  }
});

module.exports = router;
