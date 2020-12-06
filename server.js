const express = require("express");
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const webRoutes = require("./routes/web");
const mongoose = require("mongoose");
const { connectDB } = require("./app/config/db");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo")(session);

require("dotenv").config({
  path: `${path.join(__dirname, "/app/config/.env")}`,
});

//DB CONNECTION
const connection = connectDB();

const app = express();
const PORT = process.env.PORT;

let mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: mongoStore,
  })
);

/**
 * stores the cookie in mongostore in collections name
 * deletes the cookie from store after expiry date
 */
app.use(flash());
app.use(express.json());

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(express.static("public"));
app.use(expressLayout);

app.use("/", webRoutes);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./resources/views"));

app.listen(PORT, () => {
  console.log(`Server started listening on ${PORT}`);
});
