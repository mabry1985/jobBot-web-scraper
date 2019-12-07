const puppeteer = require("puppeteer");
const fs = require("fs");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const JobBoard = require("./models/JobBoard");
const SearchQuery = require("./models/SearchQuery");
require("dotenv").config();

let jobSample = [
  {
    title: "Junior React Developer",
    description: "Lorem ipsum dolor sit",
    postedBy: "Planet Argon",
    applyUrl: "https://www.planetargon.com",
  }
]

let queries;

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
  const searchQuery = new SearchQuery({
    query
  })
  await searchQuery.save(function(err) {
    if (err) return handleError(err);
      console.log("Saved new search query");
  });
}

async function searchModel() {
    
}
  
  async function main() {
  await connectToMongoDb();
  queries = await SearchQuery.find()
  for (let i = 0; i < siteList.length; i++){
    switchFunction(siteList[i].company)
  }
}

async function switchFunction(company) {
  const browser = await puppeteer.launch({ headless: false });
  switch(company){ 
    case "Google Jobs":
      await googleScrape(browser)
  }    
} 
  
async function createGoogleJobObjects(html) {
  const $ = cheerio.load(html);
  const titles = $("#gws-horizon-textlists__job_details_page").map(async (i, el) => { 
    const title = $(el).find("h2").text();
    const description = $(el).find("span[style='line-height:1.5em']").text();
    const postedBy = $(el).find("> div > div > div > div > div > div").text();
    const applyUrl = $(el).find(" span > a").attr("href").toString();

    const jobBoard = new JobBoard({
      title,
      description,
      postedBy,
      applyUrl
    })

    await jobBoard.save(function(err) {
      if (err) return handleError(err);
      console.log('Saved to JobBoard cluster')
    });
  
  }).get();

  return titles;
}

async function googleScrape(browser) {
  console.log(queries)
  queries.map( async el => {
    let search = el.query.replace(" ", "+");
    let url = `https://www.google.com/search?q=${search}&rlz=1C5CHFA_enUS860US860&oq=softwar&aqs=chrome.0.69i59j0j69i59j69i57j69i60j69i65.2127j1j4&sourceid=chrome&ie=UTF-8&ibp=htl;jobs&sa=X&ved=2ahUKEwjh4pSa5Z_mAhXPIjQIHb6yDMEQiYsCKAB6BAgCEAM#htivrt=jobs&fpstate=tldetail&htichips=date_posted:today&htischips=date_posted;today&htidocid=D8bry7zLg-f08MJsAAAAAA%3D%3D`;

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" })
      const html = await page.evaluate(() => document.body.innerHTML);
      await createGoogleJobObjects(html)
    } catch(err) {
      console.error(err)
    }
  })
}

main();