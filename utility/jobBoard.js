const JobBoard = require("../models/JobBoard");

async function save(title, description, postedBy, applyUrl,timeStamp, jobBoardSite) {
  const jobFromDb = await JobBoard.findOne({ description });
  if (!jobFromDb) {
    const jobBoard = new JobBoard({
      title,
      description,
      postedBy,
      applyUrl,
      jobBoardSite,
      timeStamp
    });
    console.log("job saved");
    return jobBoard.save();
  }
}

function jobFilterTitle(job){
  switch(job){
    case job.includes("Senior"):
      return true
    case job.includes("Sr"):
      return true
    case job.includes("SR"):
      return true
    default:
      return false;
  }
}

module.exports = {
  save,
  jobFilterTitle
};