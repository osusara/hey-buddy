const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const _auth = require("../../middleware/_auth");
const _activationCheck = require("../../middleware/_activationCheck");
const Admin = require("../../models/Admin");
dotenv.config({ path: "./config/config.env" });

// @route   GET api/_auth
// @desc    Test route
// @access  Public
router.get("/", [_auth, _activationCheck], async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.json(admin);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   POST api/_auth
// @desc    Authenticate admin (login)
// @access  Public
router.post("/", [
    check("email", "Valid email is required").isEmail(),
    check("password", "Password is required").exists(),
  ], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      // See if admin is exist
      let admin = await Admin.findOne({ email });

      if (!admin) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials" }],
        });
      }

      // compare the password in db and entered one
      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials" }],
        });
      }

      // Return JWT
      const payload = {
        admin: { id: admin.id },
      };

      jwt.sign( payload, process.env.JWT_ADMIN_SECRET, { expiresIn: 360000 }, (err, token) => {
          if (err) throw err;
          res.json({ token });
      });

    } catch (error) {
      console.log(`Error: ${error.message}`.red.bold);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
