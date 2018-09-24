'use strict';

const router = require('express').Router();
const requireLogin = require('../../middlewares/requireLogin');
const handleError = require('../../middlewares/handleError');
const services = require('../../services/water');

router.use(requireLogin);

router.get('/', requireLogin, services.getWaters);
router.get('/:day', requireLogin, services.getDailyWater);
router.put('/:day', requireLogin, services.updateDailyWater);

router.use(handleError);

module.exports = router;
