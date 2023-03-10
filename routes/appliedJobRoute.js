const express = require('express');
const router = express.Router();
// const {uploadProductImage} = require('../utils/uploadImage')
const {
  authenticateUsers,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  createAppliedJob,
  getAllAppliedJobs,
  getAllOfferedJob
} = require('../controllers/appliedJob.controller');

router
    .route("/apply-job")
    .post(authenticateUsers, authorizePermissions("admin"), createAppliedJob);

router
    .route("/get-job")
    .get(authenticateUsers, getAllAppliedJobs);

router
    .route('/offered-job')
    .patch(authenticateUsers, authorizePermissions, getAllOfferedJob)

// router
//     .route("/delete-job/:id")
//     .delete(authenticateUsers, authorizePermissions("admin"), deleteJob);



module.exports = router