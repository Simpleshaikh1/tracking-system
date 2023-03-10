const express = require('express');
const router = express.Router();
const {uploadProductImage} = require('../utils/uploadImage')
const {
  authenticateUsers,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/user.controller');

router
  .route('/')
  .get(authenticateUsers, authorizePermissions('admin'), getAllUsers);

router.route('/showMe').get(authenticateUsers, showCurrentUser);
router.route('/updateUser').patch(authenticateUsers, updateUser);
router.route('/updateUserPassword').patch(authenticateUsers, updateUserPassword);
router.route('/uploads').post(authenticateUsers,uploadProductImage)

router.route('/:id').get(authenticateUsers, getSingleUser);

module.exports = router;