'use strict';

const passport = require('passport');
const router = require('express').Router();
const mongoose = require('mongoose');

const pw = require('../services/password');
const User = mongoose.model('users');
const Water = mongoose.model('waters');
const config = require('../config/config');

router.post('/register', function(req, res) {
  if (
    !req.body.username ||
    !req.body.password ||
    req.body.username.length === 0 ||
    req.body.password === 0
  ) {
    return res.status(409).json({ message: 'username already in use' });
  }

  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (!err && foundUser) {
      return res.status(409).json({ message: 'username already in use' });
    } else {
      const newWaterId = new mongoose.mongo.ObjectID();
      const user = new User({
        username: req.body.username,
        password: pw.createHash(req.body.password),
        name: req.body.username,
        _water: newWaterId
      });

      user.save((err, createdUser) => {
        if (err) {
          return res.status(409).json({ message: 'username already in use' });
        } else {
          const water = new Water({
            _id: newWaterId,
            _user: createdUser._id,
            defaultTarget: config.WATER_TARGET_INITIAL_VALUE,
            dailyWaters: []
          });
          water.save(err => {
            if (err) {
              return res
                .status(409)
                .json({ message: 'username already in use' });
            } else {
              return res.status(200).json({ message: 'success' });
            }
          });
        }
      });
    }
  });
});

router.post('/login', passport.authenticate('local', {}), (req, res) => {
  return res.status(200).json({ message: 'success' });
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

module.exports = router;
