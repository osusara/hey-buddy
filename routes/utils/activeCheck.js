const User = require('../../models/User');

module.exports = async function (req, res) {
  try {
    const user = await User.findById(req.params.user_id).select("-password");

    if (!user)
      return res.status(404).json({ msg: "User not found" });

    if (!user.active)
      return res.json({ msg: "User is deactivated" });

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(404).json({ msg: "User not available" });
  }
};
