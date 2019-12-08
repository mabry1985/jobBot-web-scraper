const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const SearchQuery = require("./models/SearchQuery");
const google = require("./scrapers/googleJobScraper");
const dice = require('./scrapers/diceScraper');
require("dotenv").config();

let jobSample = [
  {
    title: "Junior React Developer",
    description: "Lorem ipsum dolor sit",
    postedBy: "Planet Argon",
    applyUrl: "https://www.planetargon.com",
  }
]

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
  );
  console.log("Connected to DB")
}
  
async function main() {
  await connectToMongoDb();
  const queries = await SearchQuery.find();
  await siteLoop(queries);
}

async function siteLoop(queries) {
  for (let i = 0; i < siteList.length; i++) {
    await switchFunction(siteList[i].company, queries);
    await sleep(5000);
  }
}

async function switchFunction(company, queries) {
  const browser = await puppeteer.launch({ headless: false });
  switch(company){ 
    case "Google Jobs":
      await google.googleScrape(browser, queries);
      break;
    case "Dice":
      await dice.diceScrape(browser, queries);
      break;
    }    
}   

async function sleep(mseconds) {
  return new Promise(resolve => setTimeout(resolve, mseconds));
}

main();
