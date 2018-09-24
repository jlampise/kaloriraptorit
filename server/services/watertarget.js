'use strict';

const mongoose = require('mongoose');
const Water = mongoose.model('waters');

async function getWaterTarget(req, res, next) {
  try {
    const water = await Water.findOne({ _user: req.user.id });
    if (!water) {
      throw new Error('Internal Error');
    }
    res.status(200).json({ waterTarget: water.defaultTarget });
  } catch (err) {
    next(err);
  }
}

async function updateWaterTarget(req, res, next) {
  const target = req.body.target;

  if (target === undefined || target < 0) {
    const errorMessage = `Illegal value for property 'target': ${target}.`;
    return res.status(400).json({ error: errorMessage });
  }

  try {
    const water = await Water.findOne({ _user: req.user.id });
    if (!water) {
      throw new Error('Internal Error');
    }
    water.defaultTarget = target;
    await water.save();
    res.status(200).json({ waterTarget: water.defaultTarget });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getWaterTarget,
  updateWaterTarget
};
