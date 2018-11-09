'use strict';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const MockStrategy = require('passport-mock-strategy');
const testUser = require('../config/testUser');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const pw = require('./password');
const config = require('../config/config');

const User = mongoose.model('users');
const Water = mongoose.model('waters');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id, '-password');
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

if (process.env.NODE_ENV === 'test') {
  passport.use(
    new MockStrategy(
      {
        name: 'google',
        user: testUser
      },
      (user, done) => {
        googleStrategyCallback(null, null, user, done);
      }
    )
  );
} else {
  passport.use(
    new GoogleStrategy(
      {
        name: 'google',
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
      },
      googleStrategyCallback
    )
  );
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password'
      },
      localStrategyCallback
    )
  );
}

async function localStrategyCallback(username, password, done) {
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      if (!pw.isPasswordValid(password, user.password)) {
        return done(null, false, {
          message: 'Incorrect username or password.'
        });
      } else {
        return done(null, user);
      }
    } else {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
  } catch (err) {
    done(err, null);
  }
}

async function googleStrategyCallback(
  accessToken,
  refreshToken,
  profile,
  done
) {
  try {
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      return done(null, existingUser);
    }
    const newWaterId = new mongoose.mongo.ObjectID();
    const user = await new User({
      googleId: profile.id,
      name: profile.name.givenName,
      _water: newWaterId
    }).save();
    await new Water({
      _id: newWaterId,
      _user: user._id,
      defaultTarget: config.WATER_TARGET_INITIAL_VALUE,
      dailyWaters: []
    }).save();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}
