const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const SearchQuery = require("./models/SearchQuery");
const google = require("./scrapers/googleJobScraper");
const dice = require('./scrapers/diceScraper');
const sf = require('./scrapers/siliconFloristScraper');
const file = require('./utility/files');

require("dotenv").config();

let siteList = [
  "Google Jobs", 
  "Dice", 
  "Silicon Florist"
]

async function connectToMongoDb() {
  mongooseConnection = process.env.MONGO_CONNECTION
  await mongoose.connect(
    mongooseConnection, 
    { useNewUrlParser: true}
  )
}
  
  async function main() {
    try {
      await connectToMongoDb();
      const queries = await SearchQuery.find();
      const browser = await puppeteer.launch({ headless: false });
      const resultsArray = await siteLoop(queries, browser)
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

async function siteLoop(queries, browser) {
  let resultsArray = [];
  for (let i = 0; i < siteList.length; i++) {
    const results = await switchFunction(siteList[i], queries, browser)
    resultsArray.push(results);
  }
  return resultsArray
}

async function switchFunction(company, queries, browser) {
  switch(company){ 
    case "Google Jobs":
      results = await google.googleScrape(browser, queries)
      return results
    case "Dice":
      results = await dice.diceScrape(browser, queries);
      return results;
    case "Silicon Florist":
      results = await sf.siliconFloristScrape(browser)
      return results;
    default:
      return
    }    
}   

// async function sleep(milliseconds) {
//   return new Promise(resolve => setTimeout(resolve, milliseconds));
// }

main();