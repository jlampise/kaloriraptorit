'use strict';

const passport = require('passport');
const router = require('express').Router();
const mongoose = require('mongoose');

const pw = require('../services/password');
const User = mongoose.model('users');
const Water = mongoose.model('waters');
const config = require('../config/config');

router.post('/register', async (req, res) => {
  try {
    if (
      !req.body.username ||
      !req.body.password ||
      req.body.username.length === 0 ||
      req.body.password === 0
    ) {
      throw { message: 'username already in use' };
    }

    const foundUser = await User.findOne({ username: req.body.username });
    if (foundUser) {
      throw { message: 'username already in use' };
    }

    const newWaterId = new mongoose.mongo.ObjectID();
    const user = new User({
      username: req.body.username,
      password: pw.createHash(req.body.password),
      name: req.body.username,
      _water: newWaterId
    });

    const createdUser = await user.save();

    const water = new Water({
      _id: newWaterId,
      _user: createdUser._id,
      defaultTarget: config.WATER_TARGET_INITIAL_VALUE,
      dailyWaters: []
    });
    await water.save();
    return res.status(200).json({ message: 'success' });
  } catch (err) {
    return res.status(409).json(err);
  }
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
