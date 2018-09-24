const mongoose = require('mongoose');
const { Schema } = mongoose;

const mealIngredientSchema = new Schema({
  name: { type: String, required: true },
  mass: { type: Number, required: true },
  kcal: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbohydrate: { type: Number, required: true },
  fat: { type: Number, required: true }
});

module.exports = mealIngredientSchema;
// Don't model to mongoose!
