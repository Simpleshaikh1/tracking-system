const mongoose = require('mongoose'); 

const jobSchema = new mongoose.Schema({
    companyLogo: {
        type: String
    },
    companyName: {
        type: String
    },
    jobRole: {
        type:String
    },
    location: {
        type: String
    },
    salary: {
        type: String
    },
    skill: {
        type: String
    },
    postedAt: {
        type: Date,
        default: Date.now()
    },
    jobDescription: {
        type: String
    },
    responsibility: {
        type:String
    },
    qualification: {
        type:String
    },
    requiredEducationLevel: {
        type: String
    },
    experienceLevel: {
        type: String
    },
    jobType:{
        type:String
    },
    jobRoleType: {
        type: String
    },
    isTrash: {
        type: Boolean,
        default: false,
        select: false
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'completed'],
        default: 'open'
    },
    appliedUser: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }
    ]
      
});

jobSchema.pre(/^find/, function(next){
    this.find({isTrash: {$ne: true}});
    next();
})

module.exports = mongoose.model('job', jobSchema)