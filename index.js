const puppeteer = require("puppeteer");
const fs = require("fs");
const cheerio = require("cheerio");

let jobSample = [
  {
    jobTitle: "Junior React Developer",
    jobDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad animi unde nisi consequatur dolore quaerat distinctio similique at! Incidunt, omnis! Porro sint delectus vel minus laboriosam asperiores totam vitae ullam minima! Enim, dolore! Deleniti iure beatae, modi, mollitia aperiam, perspiciatis est autem ipsum sunt voluptas architecto corrupti aliquam. Quasi, quidem!",
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

let search

let siteList = [
  {
    company: "Google Jobs",
    url: `https://www.google.com/search?rlz=1C5CHFA_enUS860US860&sxsrf=ACYBGNQoashCFDMDYOW6Aije_c9gIgCenQ:1575587263331&ei=v43pXZ-8E6vO0PEP2f-myA8&q=
    ${search}&ibp=htl;jobs&sa=X&ved=2ahUKEwj2mIqA0J_mAhVNHjQIHZKTDqkQiYsCKAB6BAgKEAM`
  },
  {
    company: "Dice",
    url: "https://ivet360.com/careers"
  }
]

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  for (let i = 0; i < siteList.length; i++){
    const page = await browser.newPage();
    const site = siteList[i];
    await page.goto(site.url);
    switchFunction(site.company, site.url)
  }
}

function switchFunction(company) {
  switch(company){ 
    case "Google Jobs":
     for(i = 0; i < searchQuery.length; i++) {
       search = searchQuery[i].replace(" ", "+");
      //  scrapeGoogleJobs(searchQuery[i])
      console.log(search);
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
      const newPath = `./${companyName}-new.txt`
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