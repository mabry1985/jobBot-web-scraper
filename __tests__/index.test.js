const index = require("../index");
const fs = require("fs");
let html;
let jobs

beforeAll(async () => {
  html = fs.readFileSync("./test-html/googleJobBoard.html"),
  jobs = index.createGoogleJobObjects(html)
  console.log(jobs);
});

it("should give correct jobs object", () => {
  return index.createGoogleJobObjects(html).then(data => {
    expect(jobs.length).toBe(36);
  });
})

it("should get correct job title", () => {
  expect(jobs[0].title).toBe("Javascript Developer");
})

it("should get correct url", () => {
  expect(jobs[0].applyUrl).toBe("https://www.google.com")
})

it("should get correct company", () => {
  expect(jobs[0].postedBy).toBe("Coder")
})

