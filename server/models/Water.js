'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const DailyWaterSchema = require('./subschemas/DailyWater');

const waterSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  dailyWaters: { type: [DailyWaterSchema], required: true },
  defaultTarget: { type: Number, required: true, min: 0 },
  _user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

mongoose.model('waters', waterSchema);
