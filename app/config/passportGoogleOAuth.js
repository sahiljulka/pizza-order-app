var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/user");

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
function init(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      function(accessToken, refreshToken, profile, done) {
        const newUser = getInfo(profile);
        User.findOne({ email: newUser.email })
          .then(async (user) => {
            if (!user) {
              const newUser = getInfo(profile);
              const user = new User({ ...newUser });
              try {
                await user.save();
                done(null, user);
                // Login
              } catch (e) {
                req.flash("error", "Something went wrong");
                return res.redirect("/register");
              }
            } else {
              done(null, user);
            }
          })
          .catch((err) => {
            done(err, null);
          });
      }
    )
  );
}

function getInfo(profile) {
  return {
    name: profile?.displayName || "user",
    email: profile.emails[0].value,
  };
}

module.exports = init;
