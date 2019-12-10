const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const SearchQuery = require("./models/SearchQuery");
const google = require("./scrapers/googleJobScraper");
const dice = require('./scrapers/diceScraper');
const file = require('./utility/files');

require("dotenv").config();

let siteList = [
  {
    company: "Google Jobs",
    url: "job board"
  },
  {
    company: "Dice",
    url: "job board"
  }
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
      file.createCsvFile(results);
  } catch(err) {
    console.error(err)
  }
}

async function siteLoop(queries, browser) {
  let resultsArray = [];
  for (let i = 0; i < siteList.length; i++) {
    const results = await switchFunction(siteList[i].company, queries, browser)
    await sleep(5000);
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
    default:
      return
    }    
}   

async function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

main();