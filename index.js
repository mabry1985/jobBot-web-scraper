const puppeteer = require("puppeteer");
const fs = require("fs");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const JobBoard = require("./models/JobBoard");
const SearchQuery = require("./models/SearchQuery");
const google = require("./scrapers/googleJobScraper");
require("dotenv").config();

let queries;

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
    url: "N/A"
  },
]

async function connectToMongoDb() {
  mongooseConnection = process.env.MONGO_CONNECTION
  await mongoose.connect(
    mongooseConnection, 
    { useNewUrlParser: true}
  );
  console.log("Connected to DB")
}
  
async function addSearchQuery(query) {
  const searchQuery = new SearchQuery({ query })
  await searchQuery.save(function(err) {
    if (err) return handleError(err);
    console.log("Saved new search query");
  });
}

async function main() {
  await connectToMongoDb();
  // await addSearchQuery("web developer")
  queries = await SearchQuery.find();
  await siteLoop(queries);
}

async function siteLoop(queries) {
  for (let i = 0; i < siteList.length; i++) {
    switchFunction(siteList[i].company, queries);
  }
}

async function switchFunction(company, queries) {
  const browser = await puppeteer.launch({ headless: false });
  switch(company){ 
    case "Google Jobs":
      await google.googleScrape(browser, queries)
  }    
}   

main();
