const scraper = require("../scrapers/googleJobScraper");
const fs = require("fs");
let html;
let jobs;

beforeAll(async () => {
  html = fs.readFileSync("./test-html/googleJobBoard.html");
  jobs = await scraper.createGoogleJobObjects(html);
});

it("should give correct jobs object length", () => {
    expect(jobs.length).toBe(21);
})

it("should get correct job title", async () => {
  await expect(jobs[0].title)
    .toBe("Full-Stack Software Engineer - Javascript");
})

it("should get correct url", () => {
  expect(jobs[0].applyUrl)
    .toBe("https://www.trinityventures.com/portfolio/new-relic"
)
})

it("should get correct company", () => {
  expect(jobs[0].postedBy).toBe("New Relic, Inc.")
})

