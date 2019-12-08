const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
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
  
async function main() {
  await connectToMongoDb();
  // await addSearchQuery("web developer")
  const queries = await SearchQuery.find();
  await siteLoop(queries);
}

async function siteLoop(queries) {
  for (let i = 0; i < siteList.length; i++) {
    await switchFunction(siteList[i].company, queries);
  }
}

async function switchFunction(company, queries) {
  const browser = await puppeteer.launch({ headless: false });
  switch(company){ 
    case "Google Jobs":
      await google.googleScrape(browser, queries);
  }    
}   

main();
