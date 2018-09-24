'use strict';

const mongoose = require('mongoose');
const Meal = mongoose.model('meals');

async function getMeals(req, res) {
  // before and after are optional params for getting
  // only meals before or/and after specific date
  try {
    const conditions = { _user: req.user.id };
    const dateConditions = {};

    if (req.query.after) {
      const after = new Date(req.query.after);
      if (!isNaN(after)) {
        dateConditions.$gt = after;
      }
    }

    if (req.query.before) {
      const before = new Date(req.query.before);
      if (!isNaN(before)) {
        dateConditions.$lt = before;
      }
    }

    if (dateConditions.$lt || dateConditions.$gt) {
      conditions.date = dateConditions;
    }

    const meals = await Meal.find(conditions);
    res.status(200).json({
      count: meals.length,
      meals: meals
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

async function addNewMeal(req, res) {
  const { name, date, ingredients } = req.body;
  const userId = req.user.id;

  // We do not accept missing properties, but somehow empty array for ingredients is created with ingredients missing
  // So we check this here independently:
  if (!ingredients) {
    return res.status(400).json({
      error: 'meals validation failed: name: Path `ingredients` is required.'
    });
  }

  try {
    const meal = new Meal({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      date: date,
      ingredients: ingredients,
      _user: userId
    });
    await meal.save();
    res.status(200).json(meal);
  } catch (err) {
    // We handle these two API user errors with different status code.
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

async function getMealWithId(req, res) {
  try {
    const mealId = req.params.mealId;
    const meal = await Meal.findOne({ _id: mealId, _user: req.user.id });
    if (meal) {
      res.status(200).json(meal);
    } else {
      res
        .status(400)
        .json({ error: 'Meal with id ' + mealId + ' does not exist.' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

async function updateMealWithId(req, res) {
  // Notice: We want all the fields here, even for subdocuments (ingredients)!
  // Could not make it with findOneAndUpdate because it did not validate fields
  // in ingredients. With .save() it did work properly.
  try {
    const mealId = req.params.mealId;

    const meal = await Meal.findOne({ _id: mealId, _user: req.user.id });
    if (meal) {
      meal.name = req.body.name;
      meal.date = req.body.date;
      meal.ingredients = req.body.ingredients;
      await meal.save();
      res.status(200).json(meal);
    } else {
      res
        .status(400)
        .json({ error: 'Meal with id ' + mealId + ' does not exist.' });
    }
  } catch (err) {
    // We handle these two API user errors with different status code.
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

async function deleteMealWithId(req, res) {
  try {
    const mealId = req.params.mealId;
    const meal = await Meal.findOneAndDelete({
      _id: mealId,
      _user: req.user.id
    });
    if (meal) {
      res.status(200).json(meal);
    } else {
      res
        .status(400)
        .json({ error: 'Meal with id ' + mealId + ' does not exist.' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = {
  getMeals,
  addNewMeal,
  getMealWithId,
  deleteMealWithId,
  updateMealWithId
};
