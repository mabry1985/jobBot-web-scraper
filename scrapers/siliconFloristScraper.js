const cheerio = require("cheerio");
const jobBoard = require("../utility/jobBoard");
const sleep = require('../utility/sleep');
const puppeteer = require("puppeteer");

async function createSiliconFloristObjects(jobPage, browser) {
  try {
    const page = await browser.newPage();
    await page.goto(jobPage, { waitUntil: "networkidle2" });
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(html);
    const title = $("div.jobDetail-header > div > h1").text()
    if (title === "") {
      return;
    } else {
      const description = $("div.job-body > p").text()
      const postedBy = $("div.text-primary.text-large > strong > a").text();
      const applyUrl = jobPage;
      const timeStamp = new Date().toLocaleDateString();
      const jobBoardSite = "Silicon-Florist";
      const searchQuery = "N/A";
      const job = {
        title,
        description,
        postedBy,
        applyUrl,
        jobBoardSite,
        searchQuery,
        timeStamp
      }
      await jobBoard.save(job);
      await sleep.sleep(1000);
      return job;
    }
  } catch (err) {
    console.error(err)
  }
}

async function scrapeJobLinks(html) {
  const $ = await cheerio.load(html);
  const results = $("div.jobList-introWrap > div > a").map((i, el) => {
    return "https://jobs.siliconflorist.com" + $(el).attr("href").toString() 
  }).get();
  return results
}

async function siliconFloristScrape() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const url = "https://jobs.siliconflorist.com";
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const html = await page.evaluate(() => document.body.innerHTML);
    const jobLinks = await scrapeJobLinks(html)
    const jobsArray = jobLinks.map(async (jobPage) => {
      return new Promise(async (resolve) => {
        const job = await createSiliconFloristObjects(jobPage, browser); 
        resolve(job);
        await sleep.sleep(1000);
    });
  })
  const jobs = await Promise.all(jobsArray);
  await browser.close();
  return jobs
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  siliconFloristScrape
};