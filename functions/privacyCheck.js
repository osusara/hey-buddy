const Profile = require('../models/Profile');

module.exports = async function (req, res) {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }, { privacy: 1});

    if (!profile)
      return res.status(404).json({ msg: "User not found" });

    return profile.privacy;

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(404).json({ msg: "User not available" });
  }
};