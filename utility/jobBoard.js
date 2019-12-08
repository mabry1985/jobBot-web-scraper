const JobBoard = require("../models/JobBoard");

async function save(title, description, postedBy, applyUrl, jobBoardSite) {
  const jobFromDb = await JobBoard.findOne({ description });
  if (!jobFromDb && !title.includes("Senior") && !title.includes("Sr") && !title.includes("SR") ) {
    const jobBoard = new JobBoard({
      title,
      description,
      postedBy,
      applyUrl,
      jobBoardSite
    });
    console.log("job saved");
    return jobBoard.save();
  } else {
    console.log("duplicate job found");
  }
}

module.exports = {
  save
};