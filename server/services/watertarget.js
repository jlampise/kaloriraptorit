'use strict';

const mongoose = require('mongoose');
const Water = mongoose.model('waters');

async function getWaterTarget(req, res) {
  try {
    const water = await Water.findOne({ _user: req.user.id });
    if (!water) {
      res
        .status(500)
        .json({ error: `No water document for the userid: ${req.user.id}.` });
    } else {
      res.status(200).json({ waterTarget: water.defaultTarget });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateWaterTarget(req, res) {
  const target = req.body.target;

  if (target === undefined || target < 0) {
    const errorMessage = `Illegal value for property 'target': ${target}.`;
    return res.status(400).json({ error: errorMessage });
  }

  try {
    const water = await Water.findOne({ _user: req.user.id });
    if (!water) {
      res
        .status(500)
        .json({ error: `No water document for the userid: ${req.user.id}.` });
    } else {
      water.defaultTarget = target;
      await water.save();
      res.status(200).json({ waterTarget: water.defaultTarget });
    }
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = {
  getWaterTarget,
  updateWaterTarget
};
