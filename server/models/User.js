'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String, // Either this...
  username: String, // Or these two
  password: String, // Or these two
  name: String, // This is used for printing out...
  _water: { type: Schema.Types.ObjectId, ref: 'Water', required: true }
});

mongoose.model('users', userSchema);
