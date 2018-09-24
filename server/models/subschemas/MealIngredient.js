'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const mealIngredientSchema = new Schema({
  name: { type: String, required: true },
  mass: { type: Number, required: true, min: 0 },
  kcal: { type: Number, required: true, min: 0 },
  protein: { type: Number, required: true, min: 0 },
  carbohydrate: { type: Number, required: true, min: 0 },
  fat: { type: Number, required: true, min: 0 }
});

module.exports = mealIngredientSchema;
// Don't model to mongoose!
