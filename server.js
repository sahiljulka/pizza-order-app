const express = require("express");
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");

require("dotenv").config({
  path: `${path.join(__dirname, "/app/config/.env")}`,
});

const app = express();
const PORT = process.env.PORT;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./resources/views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log(`Server started listening on ${PORT}`);
});

console.log(path.join(__dirname, "/public"));
