const cheerio = require("cheerio");
const jobBoard = require("../utility/jobBoard");
const request = require("request-promise");

async function createDiceJobObjects(jobPage, search) {
  const html = await request.get(jobPage);
  const $ = cheerio.load(html);
  const title = $("#header-wrap > div.container > div .jobTitle").text();
  if (jobBoard.jobFilterTitle(title) || title === "") {
    return;
  } else {
    const description = $("#jobdescSec")
      .text()
      .trim();
    const postedBy = $("#hiringOrganizationName").text();
    const applyUrl = $("#applybtn").attr("onclick");
    const timeStamp = new Date();
    const jobBoardSite = "Dice";
    const searchQuery = search;
    await jobBoard.save(
      title,
      description,
      postedBy,
      applyUrl,
      jobBoardSite,
      searchQuery,
      timeStamp
    );
  }
}

async function scrapeJobLinks(html) {
  const $ = await cheerio.load(html);
  const results = $("a.card-title-link").map((i, el) => {
    return $(el).attr("href");
  }).get();
  return results
}

async function diceScrape(browser, queries) {
 const resultsArray = queries.map(async el => {
    let search = el.query.replace(" ", "%20");
    let url = `https://www.dice.com/jobs?q=${search}&location=Portland,%20OR,%20USA&latitude=45.5051064&longitude=-122.67502609999997&countryCode=US&locationPrecision=City&radius=30&radiusUnit=mi&page=1&pageSize=20&facets=employmentType%7CpostedDate%7CworkFromHomeAvailability%7CemployerType%7CeasyApply&filters.postedDate=ONE&language=en`;
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
      const html = await page.evaluate(() => document.body.innerHTML);
      const jobLinks = await scrapeJobLinks(html)
      const jobsArray = jobLinks.map(jobPage => {
        return new Promise(async(resolve, reject) =>{
          const job = await createDiceJobObjects(jobPage, el.query)
          resolve(job);
        });
       })
      const jobs = await Promise.all(jobsArray)
      return jobs
    } catch (err) {
      console.error(err);
    }
  });
  let results = await Promise.all(resultsArray)
  results = [].concat.apply([], results);
  return results
}

module.exports = {
  diceScrape
};