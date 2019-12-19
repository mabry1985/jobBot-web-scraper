const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const SearchQuery = require("./models/SearchQuery");
const google = require("./scrapers/googleJobScraper");
const craigslist = require("./scrapers/craigslistScraper");
const dice = require('./scrapers/diceScraper');
const siliconFlorist = require('./scrapers/siliconFloristScraper');
const remoteOk = require('./scrapers/remoteOk');
const file = require('./utility/files');
require("dotenv").config();

let siteList = [
  "Google Jobs", 
  "Dice", 
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
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]});
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
  let results;
  switch(company){ 
    case "Google Jobs":
      results = await google.googleScrape(browser, queries)
      return results
    case "Dice":
      results = await dice.diceScrape(browser, queries);
      return results;
    case "Silicon Florist":
      results = await siliconFlorist.siliconFloristScrape(browser)
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