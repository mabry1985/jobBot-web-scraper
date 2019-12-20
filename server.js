const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.envPort || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_CONNECTION;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected to DB");
});

const searchRouter = require("./routes/search");

app.use("/search", searchRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});