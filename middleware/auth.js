const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

module.exports = function(req, res, next) {
  // get the token from header
  const token = req.header('x-auth-token');

  // check if the token is not available
  if(!token) {
    return res.status(401).json({
      msg: 'Authorization denied'
    });
  }

  // if token is available, verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Authorization error' });
  }
}