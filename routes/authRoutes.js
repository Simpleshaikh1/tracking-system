const express = require('express');
const router = express.Router();

const { authenticateUsers } = require('../middleware/authentication');

const {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', authenticateUsers, logout);
router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);

module.exports = router;