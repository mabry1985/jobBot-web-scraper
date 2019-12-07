const puppeteer = require("puppeteer");
const fs = require("fs");
const cheerio = require("cheerio");

let jobSample = [
  {
    jobTitle: "Junior React Developer",
    jobDescription: "Lorem ipsum dolor sit",
    company: "Planet Argon",
    applicationUrl: "https://www.planetargon.com",
  }
]

let searchQuery = [
  "web development",
  "junior developer",
  "react developer",
  "javascript developer",
]

let siteList = [
  {
    company: "Google Jobs",
  },
]

async function main() {
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
  
async function scrapeGoogleJobTitles(html) {
  const $ = cheerio.load(html);
  const titles = $("#gws-horizon-textlists__job_details_page").map((i, el) => { 
    const title = $(el).find("h2").text();
    const description = $(el).find("span[style='line-height:1.5em']").text();
    console.log(title, description)
    return { title, description }
  }).get();
  
  return titles;
}

async function scrapeGoogleJobUrls(jobs, $) {
  $("* > div > div > div > span > a").map((i, el) => {
    console.log($(el).attr("href"))
    for(let i = 0; i < jobs.length; i++) {
      jobs[i].applyUrl = $(el).attr("href").toString(); 
    }
  })
  return jobs
}

async function googleScrape(browser) {
  searchQuery.map( async (el, i) => {
    let search = el.replace(" ", "+");
    let url = `https://www.google.com/search?q=${search}&rlz=1C5CHFA_enUS860US860&oq=softwar&aqs=chrome.0.69i59j0j69i59j69i57j69i60j69i65.2127j1j4&sourceid=chrome&ie=UTF-8&ibp=htl;jobs&sa=X&ved=2ahUKEwjh4pSa5Z_mAhXPIjQIHb6yDMEQiYsCKAB6BAgCEAM#htivrt=jobs&fpstate=tldetail&htichips=date_posted:today&htischips=date_posted;today&htidocid=D8bry7zLg-f08MJsAAAAAA%3D%3D`
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" })
      const html = await page.evaluate(() => document.body.innerHTML, console.log(search, "done"));

      let jobs = await scrapeGoogleJobTitles(html)
      console.log(jobs)
    } catch(err) {
      console.error(err)
    }
  })
}

main();