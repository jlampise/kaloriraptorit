'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  name: String,
  _water: { type: Schema.Types.ObjectId, ref: 'Water', required: true }
});

mongoose.model('users', userSchema);
