const express = require("express");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const webRoutes = require("./routes/web");
const mongoose = require("mongoose");
const { connectDB } = require("./app/config/db");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo")(session);
const passport = require("passport");
const passportInit = require("./app/config/passport");
const passportGoogleInit = require("./app/config/passportGoogleOAuth");
const Emitter = require("events");
const { EventEmitter } = require("events");

require("dotenv").config({
  path: `${path.join(__dirname, "/app/config/.env")}`,
});

const app = express();
const PORT = process.env.PORT;

//DB CONNECTION
const connection = connectDB();

let mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: "sessions",
});

const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

app.use(
  session({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: mongoStore,
  })
);

passportInit(passport);
passportGoogleInit(passport);
app.use(passport.initialize());
app.use(passport.session());

/**
 * stores the cookie in mongostore in collections name
 * deletes the cookie from store after expiry date
 */
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

app.use(express.static("public"));
app.use(expressLayout);

app.use("/", webRoutes);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./resources/views"));

const server = app.listen(PORT, () => {
  console.log(`Server started listening on ${PORT}`);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("join", (orderId) => {
    socket.join(orderId);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
  io.to(`adminRoom`).emit("orderPlaced", data);
});
