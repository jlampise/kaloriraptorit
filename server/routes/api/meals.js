'use strict';

const requireLogin = require('../../middlewares/requireLogin');
const router = require('express').Router();
const services = require('../../services/meals');


router.get('/', requireLogin, services.getMeals);

router.post('/', requireLogin, services.addNewMeal);

router.get('/:mealId', requireLogin, services.getMealWithId);

router.put('/:mealId', requireLogin, services.updateMealWithId);

router.delete('/:mealId', requireLogin, services.deleteMealWithId);

module.exports = router;
