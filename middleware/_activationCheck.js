const Admin = require("../models/Admin");

module.exports = async function (req, res, next) {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin)
      return res.status(404).json({ msg: "Admin not found" });

    if (!admin.active)
      return res.json({ msg: "Admin is deactivated" });

    next();

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(404).json({ msg: "Admin not available" });
  }
};