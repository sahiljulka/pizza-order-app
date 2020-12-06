const router = require("express").Router();
const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/cartController");

router.get("/", homeController().index);

router.get("/cart", cartController().index);

router.post("/update-cart", cartController().update);

router.get("/login", authController().login);

router.get("/register", authController().register);

module.exports = router;
