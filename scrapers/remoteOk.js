const cheerio = require("cheerio");
const request = require("request-promise");
const jobBoard = require("../utility/jobBoard");
const sleep = require('../utility/sleep');

const alert = "javascript:alert('This job post is older than 30 days and the position is probably filled. Try applying to jobs posted recently instead.')"

async function scrapeDescription($, i) {
  const descriptionArray = $("div.description > div.markdown").map(async (i, el) => {
    return $(el).text() 
  }).get()
  const description = descriptionArray[i];
  return description
}

async function remoteOkScrape() {
  try {
    const url = "https://www.remoteOk.io/remote-dev-jobs"
    const html = await request.get(url);
    const $ = cheerio.load(html);
    const results = Promise.all(
      $("tr.job").map(async (i, el) => {
        const title = $(el).find("[itemprop='title']").text();
        
        if(title === ""){
          return
        }else {
          const description = await scrapeDescription($, i);
          const postedBy = $(el).find("h3[itemprop='name']").text();
          let applyUrl = $(el).find("td.source > a").attr("href")
          if(applyUrl === alert ) {
            applyUrl = "N/A: Old Job"
          } else {
            applyUrl = "https://www.remoteok.io" + applyUrl;
          }
          const jobBoardSite = "Remote OK";
          const searchQuery = "N/A";
          const timeStamp = new Date();
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
          sleep.sleep(2000)
          return job
        }
      }).get() 
      )
    return results
  } catch(err) {
    console.error(err)
  }
}

module.exports={
  remoteOkScrape
}