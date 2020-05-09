const Buddy = require('../models/Buddy');

module.exports = async function (id, req, res) {
  try {
    const youBuddy = await Buddy.findOne({ user: req.user.id });

    if (!youBuddy)
      return false;

    youBuddy.buddies.map(buddy => {
      if(buddy.user.toString() === id) {
        return true;
      }
    });

    return true;

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(404).json({ msg: "User not available" });
  }
};