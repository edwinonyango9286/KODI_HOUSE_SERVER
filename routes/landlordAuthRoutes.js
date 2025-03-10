const express = require("express");
const {
  registerNewLandlord,
  activateLandlordAccount,
  sigInLandlord,
  updatePassword,
  passwordResetToken,
  resetPassword,
  logout,
  refreshLandlordAccesToken,
  me,
} = require("../controllers/landlordAuthController");
const { landlordAuthMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// post routes
router.post("/register_new_landlord", registerNewLandlord);
router.post("/activate_landlord_account", activateLandlordAccount);
router.post("/sign_in_landlord", sigInLandlord);
router.post("/refresh_access_token", refreshLandlordAccesToken);
router.post("/password_reset_token", passwordResetToken);
router.post("/logout", logout);

// put routes
router.put("/update_landlord_password", landlordAuthMiddleware, updatePassword);
router.put("/reset_password/:token", resetPassword);
router.get("/me", landlordAuthMiddleware, me);

module.exports = router;
