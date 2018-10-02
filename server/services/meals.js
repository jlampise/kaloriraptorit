'use strict';

const mongoose = require('mongoose');
const Meal = mongoose.model('meals');

async function getMeals(req, res, next) {
  // before and after are optional params for getting
  // only meals before or/and after specific date
  try {
    const conditions = { _user: req.user.id };
    const dateConditions = {};

    if (req.query.after) {
      const after = new Date(req.query.after);
      if (isNaN(after)) {
        let e = Error(`Malformed param after=${after}.`);
        e.name = 'BadParamError';
        throw e;
      }
      dateConditions.$gt = after;
    }

    if (req.query.before) {
      const before = new Date(req.query.before);
      if (isNaN(before)) {
        let e = Error(`Malformed param before=${before}.`);
        e.name = 'BadParamError';
        throw e;
      }
      dateConditions.$lt = before;
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
    next(err);
  }
}

async function addNewMeal(req, res, next) {
  const { name, date, ingredients } = req.body;
  const userId = req.user.id;

  try {
    // We do not accept missing properties, but somehow empty array for ingredients is created with ingredients missing
    // So we check this here independently:
    if (!ingredients) {
      let e = Error(
        'meals validation failed: name: Path `ingredients` is required.'
      );
      e.name = 'ValidationError';
      throw e;
    }

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
    next(err);
  }
}

async function getMealWithId(req, res, next) {
  try {
    const mealId = req.params.mealId;
    const meal = await Meal.findOne({ _id: mealId, _user: req.user.id });
    if (!meal) {
      let e = Error(`Meal with id ${mealId} does not exist.`);
      e.name = 'BadParamError';
      throw e;
    }
    res.status(200).json(meal);
  } catch (err) {
    next(err);
  }
}

async function updateMealWithId(req, res, next) {
  // Notice: We want all the fields here, even for subdocuments (ingredients)!
  // Could not make it with findOneAndUpdate because it did not validate fields
  // in ingredients. With .save() it did work properly.
  try {
    const mealId = req.params.mealId;

    const meal = await Meal.findOne({ _id: mealId, _user: req.user.id });
    if (!meal) {
      let e = Error(`Meal with id ${mealId} does not exist.`);
      e.name = 'BadParamError';
      throw e;
    }
    meal.name = req.body.name;
    meal.date = req.body.date;
    meal.ingredients = req.body.ingredients;

    await meal.save();
    res.status(200).json(meal);
  } catch (err) {
    next(err);
  }
}

async function deleteMealWithId(req, res, next) {
  try {
    const mealId = req.params.mealId;
    const meal = await Meal.findOneAndDelete({
      _id: mealId,
      _user: req.user.id
    });
    if (!meal) {
      let e = Error(`Meal with id ${mealId} does not exist.`);
      e.name = 'BadParamError';
      throw e;
    }
    res.status(200).json(meal);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMeals,
  addNewMeal,
  getMealWithId,
  deleteMealWithId,
  updateMealWithId
};
