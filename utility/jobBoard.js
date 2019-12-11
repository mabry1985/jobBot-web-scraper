const JobBoard = require("../models/JobBoard");

async function save(title, description, postedBy, applyUrl, jobBoardSite, searchQuery, timeStamp) {
  const jobFromDb = await JobBoard.findOne({ description });
  if (!jobFromDb) {
    const jobBoard = new JobBoard({
      title,
      description,
      postedBy,
      applyUrl,
      jobBoardSite,
      searchQuery,
      timeStamp,
    });
    console.log("job saved");
    return jobBoard.save();
  }else {
    console.log("duplicate job")
  }
}

function jobFilterTitle(title){
  title = title.toLowerCase()
  if (title.includes("senior") || title.includes("sr")) {
    return true
  } else {
    return false
  }
}

module.exports = {
  save,
  jobFilterTitle
};