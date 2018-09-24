'use strict';

const mongoose = require('mongoose');
const Water = mongoose.model('waters');
const requireLogin = require('../../middlewares/requireLogin');
const moment = require('moment');
const router = require('express').Router();

router.get('/', requireLogin, async (req, res) => {
  try {
    const water = await Water.findOne({ _user: req.user.id });
    if (!water) {
      res
        .status(500)
        .json({ error: `No water document for the userid: ${req.user.id}.` });
    } else {
      return res.status(200).json(water);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/:day', requireLogin, async (req, res) => {
  const day = req.params.day;

  if (!moment(day, 'YYYY-MM-DD', true).isValid()) {
    const errorMessage = `Illegal value for param day: ${day}. Use strictly format YYYY-MM-DD with no time.`;
    return res.status(400).json({ error: errorMessage });
  }

  try {
    const water = await Water.findOne({ _user: req.user.id });
    if (!water) {
      return res
        .status(500)
        .json({ error: `No water document for the userid: ${req.user.id}.` });
    }

    const dailyWater = water.dailyWaters.find(dw => {
      return dw.date === day;
    });

    if (!dailyWater) {
      // If there is no dailyWater-document, we respond with zero desiliters
      // AND target value from user's "global" water settings
      res
        .status(200)
        .json({ date: day, desiliters: 0, target: water.defaultTarget });
    } else {
      res.status(200).json(dailyWater);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put('/:day', requireLogin, async (req, res) => {
  // Validating input values

  const day = req.params.day;
  const desiliters = req.body.desiliters;
  const target = req.body.target;

  let errorMessage = null;

  if (!moment(day, 'YYYY-MM-DD', true).isValid()) {
    errorMessage = `Illegal value for param day: ${day}. Use strictly format YYYY-MM-DD with no time.`;
  } else if (desiliters === undefined || desiliters < 0) {
    errorMessage = `Illegal value for property 'desiliters': ${desiliters}.`;
  } else if (target === undefined || target < 0) {
    errorMessage = `Illegal value for property 'target': ${target}.`;
  }

  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }

  // Getting water document and updating or creating subdocument

  try {
    const water = await Water.findOne({ _user: req.user.id });
    if (!water) {
      return res
        .status(500)
        .json({ error: `No water document for the userid: ${req.user.id}.` });
    }

    // New values to save
    var newDailyWater = {
      date: day,
      desiliters: desiliters,
      target: target
    };

    const existingDailyWater = water.dailyWaters.find(dw => {
      return dw.date === day;
    });

    if (!existingDailyWater) {
      // We save new subdocument
      water.dailyWaters.push(newDailyWater);
    } else {
      // Here is the catch... if the update is such that it only has "default-values"
      // (BOTH desiliters is zero AND target equals default-target), we actually remove
      // the daily water subdocument.
      if (
        newDailyWater.desiliters === 0 &&
        newDailyWater.target === water.defaultTarget
      ) {
        water.dailyWaters.id(existingDailyWater._id).remove();
      } else {
        Object.assign(existingDailyWater, newDailyWater);
      }
    }
    await water.save();
    return res.status(200).json(newDailyWater);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;
