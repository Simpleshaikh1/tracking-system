const mongoose = require("mongoose");

const appliedJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  jobsId: [{ type: mongoose.Types.ObjectId, ref: "Job" }],
});

const AppliedJob = mongoose.model("AppliedJobs", appliedJobSchema);

module.exports = AppliedJob;