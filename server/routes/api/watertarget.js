'use strict';

const requireLogin = require('../../middlewares/requireLogin');
const router = require('express').Router();
const services = require('../../services/watertarget');

router.get('/', requireLogin, services.getWaterTarget);

router.put('/', requireLogin, services.updateWaterTarget);

module.exports = router;
