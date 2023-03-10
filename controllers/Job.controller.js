const Job = require('../models/Job.model');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path')


const postJob = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({
        msg: "No logo uploaded",
      });
    }

    const logo = req.files.companyLogo;

    if (!logo.mimetype.startsWith("image/png")) {
      return res.status(400).json({
        msg: "upload image with .png extension",
      });
    }

    const maxSize = 1024 * 1024;

    if (logo.size > maxSize) {
      return res.status(400).json({
        msg: "upload image smaller than 1MB",
      });
    }

    const imagePath = path.join(__dirname, "../public", logo.name);
    await logo.mv(logoPath);

    const job = await Job.create({
      companyLogo: imagePath,
      companyName: req.body.companyName,
      jobRole: req.body.jobRole,
      location: req.body.location,
      salary: req.body.salary,
      skill: req.body.skill,
      jobDescription: req.body.jobDescription,
      responsibility: req.body.responsibility,
      qualification: req.body.qualification,
      requiredEducationLevel: req.body.requiredEducationLevel,
      experienceLevel: req.body.experienceLevel,
      jobType: req.body.jobType,
      jobRoleType: req.body.jobRoleType,
    });

    res.status(201).json({
      msg: "Created",
      data: job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server error",
      error: error,
    });
  }
};



const getAllJobs = async (req, res, next) => {
  // console.log(1)
  const { page = 1, limit = 10 } = req.query;

  try {
    const count = await Job.countDocuments();
    const jobs = await Job.find().skip((page - 1) * limit).limit(limit);

    if (jobs.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'No Job found'
      });
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'These are all jobs',
      data: {
        jobs,
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      }
    });
  } catch (error) {
    next(error);
  }
};



const updateJobs = async (req, res, next) => {
  try {
    const { title, description, location } = req.body;
    const updateResult = await Job.updateMany({}, { title, description, location });

    if (updateResult.nModified === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'No jobs found to update'
      });
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'All jobs have been updated',
      data: updateResult
    });
  } catch (error) {
    next(error);
  }
};





const jobHistory = async (req, res, next) =>{

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const count = await Job.countDocuments({ status: 'completed' });
    const jobs = await Job.find({ status: 'completed' })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    if (jobs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No job history found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Job history retrieved successfully',
      data: {
        jobs,
        total: count,
        page,
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    postJob,
    getAllJobs,
    updateJobs,
    // deleteJob,
    jobHistory
}