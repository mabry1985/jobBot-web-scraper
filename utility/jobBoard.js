const JobBoard = require("../models/JobBoard");

async function save(jObject) {
  const { title, description, postedBy, applyUrl, jobBoardSite, searchQuery } = jObject;
  let isSenior = false; 
  let isJunior = false;
  if (jobFilterSeniorTitle(title)){
    isSenior = true;
  }
  if (jobFilterJuniorTitle(title)) {
    isJunior = true;
  }
  const jobFromDb = await JobBoard.findOne({description});
  if (!jobFromDb) {
    const jobBoard = new JobBoard({
      title,
      description,
      postedBy,
      applyUrl,
      jobBoardSite,
      searchQuery,
      isSenior,
      isJunior,
    });
    console.log("job saved");
    return jobBoard.save();
  }else {
    console.log("duplicate job")
  }
}

function jobFilterSeniorTitle(title){
  title = title.toLowerCase()
  if (title.includes("senior") || title.includes("sr")) {
    return true
  } else {
    return false
  }
}

function jobFilterJuniorTitle(title) {
  title = title.toLowerCase();
  if (title.includes("junior") || title.includes("jr")) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  save
};