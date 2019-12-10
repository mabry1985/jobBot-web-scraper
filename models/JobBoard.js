const mongoose = require("mongoose");

const JobBoard = mongoose.model(
  "JobBoard",
  mongoose.Schema({
    title: String,
    description: String,
    postedBy: String,
    applyUrl: String,
    searchQuery: String,
    jobBoardSite: String,
    timeStamp: Date
  })
);

module.exports = JobBoard;
