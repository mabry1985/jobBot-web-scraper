const cheerio = require("cheerio");
const request = require("request-promise");
const s = require('../utility/sleep');
const jobBoard = require('../utility/jobBoard');

async function scrapePageUrls() {
  const url = "https://portland.craigslist.org/d/software-qa-dba-etc/search/sof"
  const html = await request.get(url);
  const $ = cheerio.load(html);
  const pages = $(".result-info").map((i, el) => {
    const page = $(el).find(".result-title")
      .attr("href")
      .toString();
    return page
  }).get();
  return pages
}

async function scrapeResults(pages){
  try {
    let results = Promise.all(
      pages.map(async(el, i) =>{
        if(el.includes("portland")){
          const html = await request.get(el);
          const $ = cheerio.load(html);
          const title = $('#titletextonly').text();
          const description = $("#postingbody").text();
          const postedBy = "Craigslist";
          const applyUrl = pages[i];
          const jobBoardSite = "Craigslist";
          const searchQuery = "N/A";
          const job = {
            title,
            description,
            postedBy,
            applyUrl,
            jobBoardSite,
            searchQuery, 
          }
          jobBoard.save(job)
          s.sleep(1000)
          return job
        }else {
          return
        }
      })
    )
    return results
    } catch (err) {
    console.error(err);
  }
}

async function craigslistScraper(){
  const pages = await scrapePageUrls();
  const resultsArray = scrapeResults(pages);
  let results = await Promise.resolve(resultsArray);
  return results;
}

module.exports = {
  craigslistScraper
}