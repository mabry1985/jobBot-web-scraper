const mongoose = require("mongoose");

const SearchQuery = mongoose.model(
  "SearchQuery",
  mongoose.Schema({
    query: String,
  },
    { timestamps: true }
  )
);

module.exports = SearchQuery;
