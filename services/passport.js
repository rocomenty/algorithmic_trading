const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id); // .id refers to the automatically generated id by mongoDB
});

passport.deserializeUser((id, done) => { // id is the token
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) {
                // already have a record with given profile id
                // done function: done (ERROR, Mongoose Instance)
                return done(null, existingUser);
            }
            const user = await new User({ googleId: profile.id }).save(); // a mongoose instance gets returned after saving (then passed in to user)
            done(null, user);
        }
));