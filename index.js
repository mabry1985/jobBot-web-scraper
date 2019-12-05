const puppeteer = require("puppeteer");
const fs = require("fs");

let siteList = [
  {
    company: "PlanetArgon",
    url: "https://www.planetargon.com/"
  },
  {
    company: "iVet360",
    url: "https://ivet360.com/careers"
  }
]

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  for (let i = 0; i < siteList.length; i++) {
    const page = await browser.newPage();
    await page.goto(siteList[i].url);
  }
}

main();