const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// @desc    Get user profile
// @route   GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, phone, location, bio, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error('GetProfile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, location, bio } = req.body;

    await pool.execute(
      'UPDATE users SET name = ?, phone = ?, location = ?, bio = ? WHERE id = ?',
      [name || req.user.name, phone || null, location || null, bio || null, req.user.id]
    );

    const [updatedUser] = await pool.execute(
      'SELECT id, name, email, phone, location, bio, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ success: true, user: updatedUser[0] });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/profile/password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Get user with password
    const [users] = await pool.execute(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    );

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('ChangePassword error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete account
// @route   DELETE /api/profile
exports.deleteAccount = async (req, res) => {
  try {
    // Delete user (cascade will delete all job applications)
    await pool.execute('DELETE FROM users WHERE id = ?', [req.user.id]);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('DeleteAccount error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
