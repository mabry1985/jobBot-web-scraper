const router = require("express").Router();
const Search = require("../models/SearchQuery");

router.route("/").get((req, res) => {
  Search.find()
    .then(queries => res.json(queries))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const query = req.body.query;

  const newSearch = new Search({
    query,
  });

  newSearch
    .save()
    .then(() => res.json("Search added"))
    .catch(err => res.status(400).json("Error " + err));
});

router.route("/:id").get((req, res) => {
  Search.findById(req.params.id)
    .then(query => res.json(query))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Search.findById(req.params.id)
    .then(search => {
      search.query = req.body.query;

      search
        .save()
        .then(() => res.json("Search updated!"))
        .catch(err => res.status(400).json("Error: " + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Search.findByIdAndDelete(req.params.id)
    .then(() => res.json("Search deleted."))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
