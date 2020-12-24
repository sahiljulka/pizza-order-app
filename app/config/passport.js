const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

function init(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      // Here is the function that is supplied with the username and password field from the login POST request
      function(email, password, cb) {
        // Search the MongoDB database for the user with the supplied username
        User.findOne({ email: email })
          .then((user) => {
            /**
             * The callback function expects two values:
             *
             * 1. Err
             * 2. User
             *
             * If we don't find a user in the database, that doesn't mean there is an application error,
             * so we use `null` for the error value, and `false` for the user value
             */
            if (!user) {
              return cb(null, false, { message: "No User with this email id" });
            }
            /**
             * Since the function hasn't returned, we know that we have a valid `user` object.  We then
             * validate the `user` object `hash` and `salt` fields with the supplied password using our
             * utility function.  If they match, the `isValid` variable equals True.
             */
            const isValid = validatePassword(password, user.password);
            if (isValid) {
              // Since we have a valid user, we want to return no err and the user object
              return cb(null, user, { message: "Logged In Successfully" });
            } else {
              // Since we have an invalid user, we want to return no err and no user
              return cb(null, false, { message: "Wrong Username or Password" });
            }
          })
          .catch((err) => {
            // This is an application error, so we need to populate the callback `err` field with it
            cb(err);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, cb) {
    User.find({ _id: id }, function(err, user) {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });
}

function validatePassword(password, hashedPswrd) {
  return bcrypt.compareSync(password, hashedPswrd);
}

module.exports = init;
