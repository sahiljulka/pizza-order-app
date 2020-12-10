const bcrypt = require("bcrypt");
const User = require("../../models/user");
const passport = require("passport");

function homeController() {
  return {
    login(req, res) {
      res.render("./auth/login");
    },
    register(req, res) {
      res.render("./auth/register");
    },
    async registerUser(req, res) {
      const { name, email, password } = req.body;
      if (!(name && email && password)) {
        req.flash("error", "All fields are required");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      // check if same email user exists
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash("error", "Email already exists");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
      });

      // password hash
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a User
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      try {
        await user.save();
        // Login
        res.redirect("/");
      } catch (e) {
        req.flash("error", "Something went wrong");
        return res.redirect("/redirect");
      }
    },
    async loginUser(req, res, next) {
      const { email, password } = req.body;
      // Validate request
      if (!email || !password) {
        req.flash("error", "All fields are required");
        return res.redirect("/login");
      }
      passport.authenticate("local", (err, user, info) => {
        console.log(user);
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }
        req.logIn(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }
          console.log(req.user);
          return res.redirect("/");
        });
      })(req, res, next);
    },
    async logoutUser(req, res, next) {
      req.logout();
      return res.redirect("/login");
    },
  };
}

module.exports = homeController;
