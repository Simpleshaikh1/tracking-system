const mongoose = require('mongoose')

const offeredJob = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ['accepted', 'declined', 'pending'],
    default: 'pending'
  }
})

module.exports = mongoose.model('offeredJob', offeredJobSchema)

