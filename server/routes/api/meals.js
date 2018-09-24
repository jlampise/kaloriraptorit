'use strict';

const router = require('express').Router();
const requireLogin = require('../../middlewares/requireLogin');
const handleError = require('../../middlewares/handleError');
const services = require('../../services/meals');

router.use(requireLogin);

router.get('/', services.getMeals);
router.post('/', services.addNewMeal);
router.get('/:mealId', services.getMealWithId);
router.put('/:mealId', services.updateMealWithId);
router.delete('/:mealId', services.deleteMealWithId);

router.use(handleError);

module.exports = router;
