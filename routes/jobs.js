const router = require("express").Router();
const Job = require("../models/JobBoard");

router.route("/").get((req, res) => {
  Job.find()
    .then(jobs => res.json(jobs))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Job.findById(req.params.id)
    .then(job => res.json(job))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;