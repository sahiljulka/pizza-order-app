const router = require("express").Router();
const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/cartController");
const guest = require("../app/http/middlewares/guest");

router.get("/", homeController().index);

router.get("/cart", cartController().index);

router.post("/update-cart", cartController().update);

router.get("/login", guest, authController().login);

router.post("/login", authController().loginUser);

router.get("/register", guest, authController().register);

router.post("/register", authController().registerUser);

router.post("/logout", authController().logoutUser);

module.exports = router;
