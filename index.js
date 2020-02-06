const mongoose = require("mongoose");
const SearchQuery = require("./models/SearchQuery");
const google = require("./scrapers/googleJobScraper");
const craigslist = require("./scrapers/craigslistScraper");
const siliconFlorist = require('./scrapers/siliconFloristScraper');
const remoteOk = require('./scrapers/remoteOk');
const file = require('./utility/files');
require("dotenv").config();

let siteList = [
  "Google Jobs", 
  "Silicon Florist",
  "Remote OK",
  "Craigslist",
]

async function connectToMongoDb() {
  const mongooseConnection = process.env.MONGO_CONNECTION
  await mongoose.connect(
    mongooseConnection, 
    { useNewUrlParser: true}
  )
}
  
  async function main() {
    try {
      await connectToMongoDb();
      const queries = await SearchQuery.find();
      const resultsArray = await siteLoop(queries)
      let results = await Promise.all(resultsArray);
      results = [].concat.apply([], results);
      const filtered = results.filter(function (el) {
        return el != null;
      });
      file.createCsvFile(filtered);
  } catch(err) {
    console.error(err)
  }
}

async function siteLoop(queries) {
  let resultsArray = [];
  for (let i = 0; i < siteList.length; i++) {
    const results = await switchFunction(siteList[i], queries)
    resultsArray.push(results);
  }
  return resultsArray
}

async function switchFunction(company, queries) {
  let results;
  switch(company){ 
    case "Google Jobs":
      results = await google.googleScrape(queries);
      return results;
    case "Silicon Florist":
      results = await siliconFlorist.siliconFloristScrape();
      return results;
    case "Remote OK":
      results = await remoteOk.remoteOkScrape();
      return results;
    case "Craigslist":
      results = await craigslist.craigslistScraper();
      return results;
    default:
      return
    }    
}   

main();