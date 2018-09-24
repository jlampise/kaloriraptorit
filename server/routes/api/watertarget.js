'use strict';

const router = require('express').Router();
const requireLogin = require('../../middlewares/requireLogin');
const handleError = require('../../middlewares/handleError');
const services = require('../../services/watertarget');

router.use(requireLogin);

router.get('/', requireLogin, services.getWaterTarget);
router.put('/', requireLogin, services.updateWaterTarget);

router.use(handleError);

module.exports = router;
