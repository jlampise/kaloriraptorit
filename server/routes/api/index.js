'use strict';

const mealRouter = require('./meals');
const waterRouter = require('./water');
const watertargetRouter = require('./watertarget');
const ingredientsRouter = require('./ingredients');
const currentUserRouter = require('./current_user');
const logoutRouter = require('./logout');

const router = require('express').Router();

router.use('/meals', mealRouter);
router.use('/water', waterRouter);
router.use('/watertarget', watertargetRouter);
router.use('/ingredients', ingredientsRouter);
router.use('/current_user', currentUserRouter);
router.use('/logout', logoutRouter);

module.exports = router;
