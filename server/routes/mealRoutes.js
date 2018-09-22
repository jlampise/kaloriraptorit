const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const _ = require('lodash');

const Meal = mongoose.model('meals');

module.exports = app => {
  app.get('/api/meals', requireLogin, async (req, res) => {
    // before and after are optional params for getting
    // only meals before or/and after specific date
    try {
      const conditions = { _user: req.user.id };
      const dateConditions = {};

      if (req.query.after) {
        const after = new Date(req.query.after);
        if (!isNaN(after)) {
          dateConditions.$gt = after ;
        }
      }

      if (req.query.before) {
        const before = new Date(req.query.before);
        if (!isNaN(before)) {
          dateConditions.$lt = before;
        }
      }

      if(dateConditions.$lt || dateConditions.$gt) {
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
  });

  app.post('/api/meals', requireLogin, async (req, res) => {
    const { name, date, ingredients } = req.body;
    const userId = req.user.id;
    const meal = new Meal({
      _id: new mongoose.Types.ObjectId(),
      name,
      date: date,
      ingredients,
      _user: userId
    });
    try {
      await meal.save();
      res.status(200).json({
        message: 'New meal was created',
        createdMeal: meal
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  app.get('/api/meals/:mealId', requireLogin, async (req, res) => {
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
  });

  app.put('/api/meals/:mealId', requireLogin, async (req, res) => {
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
  });

  app.delete('/api/meals/:mealId', requireLogin, async (req, res) => {
    try {
      const id = req.params.mealId;
      const meal = await Meal.findOneAndRemove({ _id: id, _user: req.user.id });
      if (!meal) {
        return res.status(404).json({
          message: 'Meal with given id does not exist',
          id: id
        });
      } else {
        return res.status(200).json({
          message: 'Meal with the given id was deleted',
          id: id
        });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
};
