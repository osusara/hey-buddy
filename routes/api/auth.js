const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const User = require("../../models/User");
dotenv.config({ path: "./config/config.env" });

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   POST api/auth
// @desc    Authenticate user (login)
// @access  Public
router.post('/', [
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {

  // Check for validation errors
  const errors = validationResult(req);
  if(!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    // See if user is exist
    let user = await User.findOne({ email });

    if(!user) {
      return res.status(400).json({ errors: [{
        msg: 'Invalid credentials'
      }] });
    }

    // compare the password in db and entered one
    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch) {
      return res.status(400).json({ errors: [{
        msg: 'Invalid credentials'
      }] });
    }

    // Return JWT
    const payload = {
      user: { id: user.id, active: user.active }
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
