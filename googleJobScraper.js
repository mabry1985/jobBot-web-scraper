const cheerio = require('cheerio');
const JobBoard = require("./models/JobBoard");

async function createGoogleJobObjects(html) {
  const $ = cheerio.load(html);
  const titles = $("#gws-horizon-textlists__job_details_page")
    .map(async (i, el) => {
      const title = $(el)
        .find("h2")
        .text();
      const description = $(el)
        .find("span[style='line-height:1.5em']")
        .text();
      const postedBy = $(el)
        .find("> div > div > div > div > div > div")
        .text();
      const applyUrl = $(el)
        .find(" span > a")
        .attr("href")
        .toString();

      const jobBoard = new JobBoard({
        title,
        description,
        postedBy,
        applyUrl
      });

      await jobBoard.save(function(err) {
        if (err) return handleError(err);
        console.log("Saved to JobBoard cluster");
      });
    })
    .get();

  return titles;
}

async function googleScrape(browser, queries) {
  queries.map(async el => {
    let search = el.query.replace(" ", "+");
    let url = `https://www.google.com/search?q=${search}&rlz=1C5CHFA_enUS860US860&oq=softwar&aqs=chrome.0.69i59j0j69i59j69i57j69i60j69i65.2127j1j4&sourceid=chrome&ie=UTF-8&ibp=htl;jobs&sa=X&ved=2ahUKEwjh4pSa5Z_mAhXPIjQIHb6yDMEQiYsCKAB6BAgCEAM#htivrt=jobs&fpstate=tldetail&htichips=date_posted:today&htischips=date_posted;today&htidocid=D8bry7zLg-f08MJsAAAAAA%3D%3D`;

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });
      const html = await page.evaluate(() => document.body.innerHTML);
      // fs.writeFileSync("./googleJobBoard.html", html)

      await createGoogleJobObjects(html);
    } catch (err) {
      console.error(err);
    }
  });
}

module.exports = {
  googleScrape
};