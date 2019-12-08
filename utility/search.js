async function addSearchQuery(query) {
  const searchQuery = new SearchQuery({ query });
  await searchQuery.save(function(err) {
    if (err) return handleError(err);
    console.log("Saved new search query");
  });
}


module.exports = {
  addSearchQuery
}