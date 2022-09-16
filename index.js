require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = parseInt(process.env.PORT);

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.options("*", cors());
app.use(cors());
app.use(require("./api"));

app.listen(PORT, ()=> {
    console.log(`gallery api is not running at ${PORT}`);
});