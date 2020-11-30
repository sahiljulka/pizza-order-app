const router = require("express").Router();

router.get("/cart", (req, res) => {
  res.render("./customers/cart");
});

router.get("/login", (req, res) => {
  res.render("./auth/login");
});

router.get("/register", (req, res) => {
  res.render("./auth/register");
});

module.exports = router;
