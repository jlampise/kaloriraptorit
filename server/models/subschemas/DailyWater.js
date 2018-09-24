'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const dateValidator = require('../validators/isProperDayFormat');

const dailyWaterSchema = new Schema({
  date: { type: String, required: true, unique: true, validate: dateValidator },
  desiliters: { type: Number, required: true, min: 0 },
  target: { type: Number, required: true, min: 0 }
});

module.exports = dailyWaterSchema;
// Don't model to mongoose!
