const Buddy = require('../models/Buddy');

module.exports = async function (req, res) {
  try {
    const youBuddy = await Buddy.findOne({ user: req.user.id });

    if (!youBuddy)
      return false;

    youBuddy.buddies.map(buddy => {
      if(buddy.user.toString() === req.params.user_id)
        return true;
    });

    return false;

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(404).json({ msg: "User not available" });
  }
};