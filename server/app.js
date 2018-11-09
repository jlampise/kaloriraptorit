'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const app = express();

// Create models and setup db
require('./models/User');
require('./models/Meal');
require('./models/Water');
require('./services/passport');
mongoose.set('useCreateIndex', true);
mongoose.connect(
  keys.mongoURI,
  {
    useNewUrlParser: true
  }
);

// Setup middleware
app.use(bodyParser.json());
app.use(
  cookieSession({
    name: 'kr-session',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());


// Setup routes
const routes = require('./routes');
routes.init(app);

// Setup production-only routing
if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like our main.js, or main.css file
  app.use(express.static('client/build'));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = app;
