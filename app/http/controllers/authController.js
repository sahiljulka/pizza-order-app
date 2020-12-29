const bcrypt = require("bcrypt");
const User = require("../../models/user");
const passport = require("passport");
var mongoose = require("mongoose");

function authController() {
  const _getRedirectUrl = (req) => {
    return req.user.role === "admin" ? "/adminorders" : "/orders";
  };

  loginUser = async (req, res, next) => {
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
        return res.redirect(_getRedirectUrl(req));
      });
    })(req, res, next);
  };

  return {
    login(req, res) {
      res.render("./auth/login");
    },
    register(req, res) {
      res.render("./auth/register");
    },
    registerUser(req, res, next) {
      const { name, email, password } = req.body;
      if (!(name && email && password)) {
        req.flash("error", "All fields are required");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      // check if same email user exists
      User.exists({ email: email }, async (err, result) => {
        if (result) {
          req.flash("error", "Email already exists");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
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
          await loginUser(req, res, next);
        } catch (e) {
          req.flash("error", "Something went wrong");
          return res.redirect("/register");
        }
      });
    },
    loginUser,
    logoutUser(req, res, next) {
      console.log("***********");
      req.logout();
      return res.redirect("/login");
    },
    googleLogin(req, res, next) {
      return res.redirect(_getRedirectUrl(req));
    },
  };
}

module.exports = authController;
