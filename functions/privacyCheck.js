const Profile = require('../models/Profile');

module.exports = async function (id, res) {
  try {
    const profile = await Profile.findById(id).select("-password");

    if (!profile)
      return res.status(404).json({ msg: "User not found" });

    if (!profile.privacy)
      return false;
      // return res.json({ msg: "This user is private" });

    return true;

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(404).json({ msg: "User not available" });
  }
};