const mongoose = require("mongoose");

const JobBoard = mongoose.model(
  "JobBoard",
  mongoose.Schema({
    title: String,
    description: String,
    postedBy: String,
    applyUrl: String,
    jobBoardSite: String,
    searchQuery: String,
    timeStamp: Date,
    isSenior: Boolean,
    isJunior: Boolean
  })
);

module.exports = JobBoard;
