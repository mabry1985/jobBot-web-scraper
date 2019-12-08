const JobBoard = require("../models/JobBoard");

async function save(title, description, postedBy, applyUrl) {
  const jobFromDb = await JobBoard.findOne({ description });
  if (!jobFromDb) {
    const jobBoard = new JobBoard({
      title,
      description,
      postedBy,
      applyUrl
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