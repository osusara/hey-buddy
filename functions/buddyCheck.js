const Buddy = require('../models/Buddy');

module.exports = async function (id, req, res) {
  try {
    const youBuddy = await Buddy.findById(req.user.id).select("-password");

    if (!youBuddy)
      return res.status(404).json({ msg: "User not found" });

    if (youBuddy.buddies.some(buddy => buddy.user.toString() === id))
      return true;

    return false;

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(404).json({ msg: "User not available" });
  }
};