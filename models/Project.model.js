const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  projectTitle: {
    type: String
  },
  projectLink: {
    type: String
  },
  projectDescription: {
    type: String
  },
});

module.exports = mongoose.model("Project", projectSchema);

