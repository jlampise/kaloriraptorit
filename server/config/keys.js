// keys.js - figure out what set of credentials to return
if (process.env.NODE_ENV === 'production') {
  // Return the prod set of keys (Heroku sets this env-variable)
  module.exports = require('./prodKeys');
} else if (process.env.NODE_ENV === 'test') {
  // Return the test keys (We set the variable when running tests)
  module.exports = require('./testKeys');
} else {
  // Return the dev keys
  module.exports = require('./devKeys');
}
