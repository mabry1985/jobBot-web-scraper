const cheerio = require("cheerio");
const jobBoard = require("../utility/jobBoard");

async function createSiliconFloristObjects(jobPage, browser) {
  try {
    const page = await browser.newPage();
    await page.goto(jobPage, { waitUntil: "networkidle2" });
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(html);
    const title = $("div.jobDetail-header > div > h1").text()
    if (jobBoard.jobFilterTitle(title) || title === "") {
      return;
    } else {
      const description = $("div.job-body > p").text()
      const postedBy = $("div.text-primary.text-large > strong > a").text();
      const applyUrl = jobPage;
      const timeStamp = new Date();
      const jobBoardSite = "Silicon-Florist";
      const searchQuery = "N/A";
      await jobBoard.save(
        title,
        description,
        postedBy,
        applyUrl,
        jobBoardSite,
        searchQuery,
        timeStamp
      );
      return {
        title,
        description,
        postedBy,
        applyUrl,
        jobBoardSite,
        searchQuery,
        timeStamp
      }
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

async function siliconFloristScrape(browser) {
  try {
    const url = "https://jobs.siliconflorist.com";
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const html = await page.evaluate(() => document.body.innerHTML);
    const jobLinks = await scrapeJobLinks(html)
    const jobsArray = jobLinks.map(jobPage => {
    return new Promise(async (resolve) => {
      const job = await createSiliconFloristObjects(jobPage, browser); 
      resolve(job);
    });
  })
  const jobs = await Promise.all(jobsArray)
  return jobs
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  siliconFloristScrape
};