const jobBoard = require("../utility/jobBoard")

describe('job filters', () => {
  
  test('should return true if title contains Senior or SR', () => {
    let title = "Senior React Developer";
    expect(jobBoard.jobFilterTitle(title)).toBe(true);
  })

  test('should return false if job does not contain the word Senior or SR', () => {
    let title = "Javascript Ninja"
    expect(jobBoard.jobFilterTitle(title)).toBe(false);
  })

}) 