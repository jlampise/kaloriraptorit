'use strict';

const requireLogin = require('../../middlewares/requireLogin');
const router = require('express').Router();
const services = require('../../services/water');

router.get('/', requireLogin, services.getWaters);

router.get('/:day', requireLogin, services.getDailyWater);

router.put('/:day', requireLogin, services.updateDailyWater);

module.exports = router;
