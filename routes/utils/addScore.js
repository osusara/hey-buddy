const Profile = require("../../models/Profile");

module.exports = async function (id, score, req, res) {
  try {
    let profile = await Profile.findOne({ user: id });

    if (!profile) return res.status(404).json({ msg: 'User not found' });

    const currentScore = profile.score;

    profile = await Profile.findOneAndUpdate(
      { user: id },
      { $set: { score: currentScore + score} },
      { new: true }
    );

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(404).json({ msg: "Score system error" });
  }
};
 