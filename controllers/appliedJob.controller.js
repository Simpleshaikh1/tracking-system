const Job = require("../models/Job.model");
const AppliedJob = require("../models/AppliedJob.model");



const createAppliedJob = async (req, res) => {
  try {
    const { user: userId } = req;
    const { id: jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    if (job.appliedUser.some((user) => user.equals(userId))) {
      return res
        .status(400)
        .json({ msg: "You have applied for this job before" });
    }

    job.appliedUser.push(userId);
    await job.save();

    let appliedJobs = await JobsApplied.findOne({ userId });

    if (!appliedJobs) {
      appliedJobs = await AppliedJob.create({ userId, jobsId: [] });
    }

    if (jobsApplied.jobsId.includes(jobId)) {
      return res
        .status(400)
        .json({ msg: "You have applied for this job before" });
    }

    appliedJobs.jobsId.push(jobId);

    await appliedJobs.save();

    return res.status(200).json({ msg: "Successfully applied" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server Error",
      error,
    });
  }
};

const getAllAppliedJobs = async (req, res) => {
  try {
    const { user } = req;

    const userAppliedJobs = await AppliedJob.findOne({ userId: user });

    if (!userAppliedJobs) {
      return res.status(404).json({
        msg: "No applied job found",
      });
    }

    const appliedJobIds = userAppliedJobs.jobsId;

    const page = parseInt(req.query.page || 1, 10);
    const limit = parseInt(req.query.limit || 10, 10);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const jobs = await Job.find({ _id: { $in: appliedJobIds } })
      .skip(startIndex)
      .limit(limit);

    const totalJobs = await Jobs.countDocuments({
      _id: { $in: appliedJobIds },
    });
    const totalPages = Math.ceil(totalJobs / limit);

    res.status(200).json({
      msg: "Applied Jobs Pulled",
      amount: jobs.length,
      data: jobs,
      pagination: {
        currentPage: page,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server Error",
      error,
    });
  }
};

const getAllOfferedJob = async (req, res) => {
  try {
    const { user } = req;

    const existingUserJob = await JobsApplied.findOne({ userId: user });

    const offeredJob = existingUserJob.jobsId.filter((jobId) => {
      const job = Job.findById(jobId);

      if (job && job.status === "accepted") {
        return true;
      }

      return false;
    });

    res.status(200).json({
      msg: "Offered jobs pulled",
      amount: offeredJob.length,
      data: offeredJob,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server Error",
      error,
    });
  }
};

module.exports = {
  createAppliedJob,
  getAllAppliedJobs,
  getAllOfferedJob
}