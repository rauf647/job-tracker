const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteAccount);

router.put('/password', changePassword);

module.exports = router;
