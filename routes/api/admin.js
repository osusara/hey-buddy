const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const _auth = require("../../middleware/_auth");
const _activationCheck = require("../../middleware/_activationCheck");
const Admin = require("../../models/Admin");
dotenv.config({ path: "./config/config.env" });

// @route   POST api/admin
// @desc    Register admin
// @access  Public
router.post("/", [_auth, _activationCheck, [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a password with 8 or more characters").isLength({ min: 8 }),
  ]], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    try {
      // See if admin is exist
      let admin = await Admin.findOne({ email });

      if (admin) {
        return res.status(400).json({
          errors: [{ msg: "Email is already used by another admin" }],
        });
      }

      admin = new Admin({
        username,
        email,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);

      await admin.save();

      // Return JWT
      const payload = {
        admin: { id: admin.id },
      };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
          if (err) throw err;
          res.json({ token });
      });

    } catch (error) {
      console.log(`Error: ${error.message}`.red.bold);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT api/admin
// @desc    Activate/deactivate admin
// @access  Public
router.put("/", _auth, async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.admin.id });

    admin.active = !admin.active;
    await admin.save();

    if (admin.active) {
      return res.json(admin);
    } else {
      return res.json({ msg: "Your profile is now deactivated!" });
    }

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

module.exports = router;
