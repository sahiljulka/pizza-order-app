const router = require("express").Router();
const passport = require("passport");
const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/cartController");
const orderController = require("../app/http/controllers/orderController");
const adminOrderController = require("../app/http/controllers/admin/orderController");
const statusController = require("../app/http/controllers/admin/statusController");

const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");

router.get("/", homeController().index);

router.get("/cart", cartController().index);

router.post("/update-cart", cartController().update);

router.get("/login", guest, authController().login);

router.post("/login", authController().loginUser);

router.get("/register", guest, authController().register);

router.post("/register", authController().registerUser);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController().googleLogin
);

router.post("/logout", authController().logoutUser);

router.post("/orders", auth, orderController().postOrder);

router.get("/orders", auth, orderController().index);

router.get("/orders/:id", auth, orderController().show);

router.get("/adminorders", admin, adminOrderController().index);

router.post("/adminorders/status", admin, statusController().changeStatus);

module.exports = router;
