const ObjectsToCsv = require("objects-to-csv");

async function createCsvFile(data, company) {
  const csv = new ObjectsToCsv(data);
  await csv.toDisk(`./${company}.csv`);
}

module.exports = {
  createCsvFile
}