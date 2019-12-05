const puppeteer = require("puppeteer");
const fs = require("fs");
const cheerio = require("cheerio");

let searchQuery = [
  "web development"
]


let siteList = [
  {
    company: "Google Jobs",
    url: `https://www.google.com/search?rlz=1C5CHFA_enUS860US860&sxsrf=ACYBGNQoashCFDMDYOW6Aije_c9gIgCenQ:1575587263331&ei=v43pXZ-8E6vO0PEP2f-myA8&q=
    ${searchQuery.replace(" ", "+")}+teset&ibp=htl;jobs&sa=X&ved=2ahUKEwj2mIqA0J_mAhVNHjQIHZKTDqkQiYsCKAB6BAgKEAM`
  },
  {
    company: "Dice",
    url: "https://ivet360.com/careers"
  }
]

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const $ = cheerio
  for (let i = 0; i < siteList.length; i++){
    const page = await browser.newPage();
    await page.goto(siteList[i].url);
    const html = await page.content();

    switchFunction(siteList[i].company, searchQuery)
  }
}

function switchFunction(company, searchQuery) {
  switch(company){ 
    case "Google Jobs":
     for(i = 0; i < searchQuery[i]; i++) {
       scrapeGoogleJobs(searchQuery[i])
     }
    // case "Dice":
    //  scrapeDice(searchQuery)
  }
  
} 

async function scrapeGoogleJobs(searchQuery) {

}

// async function scrapeDice




//logic for writingfiles 
function writeFiles(companyName, html) {
  const path = `./${companyName}.txt`
  
  try {
    if (fs.existsSync(path)) {
      ggconst newPath = `./${companyName}-new.txt`
      fs.writeFileSync(newPath, html);
      compareFiles(path, newPath);
    } else 
      fs.writeFileSync(path, html);
  } catch (err) {
    console.error(err)
  }
}

function compareFiles(file1, file2) {
  console.log(file1 === file1)
}

main();