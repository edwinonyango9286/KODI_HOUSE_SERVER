const User = require("../models/userModel");

const logoutService = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }
  const user = await User.findOneAndUpdate(
    { refreshToken },
    { refreshToken: null },
    { new: true }
  ).select("+refreshToken");

  return user;
};

module.exports = { logoutService };
