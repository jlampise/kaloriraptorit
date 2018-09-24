const mongoose = require('mongoose');
const { Schema } = mongoose;

const dailyWaterSchema = new Schema({
  date: { type: String, required: true, unique: true },
  desiliters: { type: Number, required: true },
  target: { type: Number, required: true }
});

module.exports = dailyWaterSchema;
// Don't model to mongoose!
