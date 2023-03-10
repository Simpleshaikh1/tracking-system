const express = require('express');
const router = express.Router();
// const {uploadProductImage} = require('../utils/uploadImage')
const {
  authenticateUsers,
  authorizePermissions,
} = require('../middleware/authentication');

const {
    postJob,
    getAllJobs,
    updateJobs,
    deleteJob,
    jobHistory
} = require('../controllers/Job.controller');

router
    .route("/post-job")
    .post(authenticateUsers, authorizePermissions("admin"), postJob);

router
    .route("/get-job")
    .get(authenticateUsers, getAllJobs);

router
    .route('/update-job/:id')
    .patch(authenticateUsers, authorizePermissions("admin"), updateJobs)

// router
//     .route("/delete-job/:id")
//     .delete(authenticateUsers, authorizePermissions("admin"), deleteJob);

router
    .route("/get-job-history")
    .get(authenticateUsers, jobHistory);


module.exports = router