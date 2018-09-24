'use strict';

const mongoose = require('mongoose');
const Water = mongoose.model('waters');
const isProperDayFormat = require('../models/validators/isProperDayFormat');

async function getWaters(req, res, next) {
  try {
    const water = await Water.findOne({ _user: req.user.id });
    if (!water) {
      throw new Error('Internal Error');
    }
    res.status(200).json(water);
  } catch (err) {
    next(err);
  }
}

async function getDailyWater(req, res, next) {
  const day = req.params.day;

  try {
    if (!isProperDayFormat(day)) {
      let e = new Error(`Illegal value for param day: ${day}.`);
      e.name = 'ValidationError';
      throw e;
    }

    const water = await Water.findOne({ _user: req.user.id });
    if (!water) {
      throw new Error('Internal Error');
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
    next(err);
  }
}

async function updateDailyWater(req, res, next) {
  // New values to save
  var newDailyWater = {
    date: req.params.day,
    desiliters: req.body.desiliters,
    target: req.body.target
  };

  // Getting water document and updating or creating subdocument

  try {
    const water = await Water.findOne({ _user: req.user.id });
    if (!water) {
      throw new Error('Internal Error');
    }

    const existingDailyWater = water.dailyWaters.find(dw => {
      return dw.date === newDailyWater.date;
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
    next(err);
  }
}

module.exports = {
  getWaters,
  getDailyWater,
  updateDailyWater
};
