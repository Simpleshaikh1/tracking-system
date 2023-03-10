const mongoose = require("mongoose");

const aboutMeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  about: {
    type: String,
  },
});

module.exports = mongoose.model("About", aboutMeSchema);

