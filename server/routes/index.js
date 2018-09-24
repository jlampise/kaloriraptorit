'use strict';

const apiRouter = require('./api');
const authRouter = require('./auth');

function init(server) {

  server.use('/api', apiRouter);
  server.use('/auth', authRouter);
}

module.exports = {
  init: init
};
