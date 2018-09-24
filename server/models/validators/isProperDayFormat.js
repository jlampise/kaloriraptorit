'use strict';

const moment = require('moment');

module.exports = (day) => {
  return moment(day, 'YYYY-MM-DD', true).isValid();
};
