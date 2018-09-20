const app = require('../app');
const testUser = require('../config/testUser');

const mongoose = require('mongoose');
const Meal = mongoose.model('meals');
const User = mongoose.model('users');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

// Will not close the server automatically
const agent = chai.request.agent(app);

describe('/api/meals', () => {
  before(done => {
    agent.get('/auth/google').end(() => {
      done();
    });
  });

  after(done => {
    agent.get('/api/logout').end(async (err, res) => {
      agent.close();
      // Finding all the meals of the test user and deleting them
      const users = await User.find({ googleId: testUser.id });
      await Meal.deleteMany({ _user: users[0]._id });
      done();
    });
  });

  describe('POST /api/meals/new', () => {
    it('adding meal with proper parameters', done => {
      agent
        .post('/api/meals/new')
        .send({
          date: '2018-04-04T10:00:00+03:00',
          name: 'Aamiainen',
          ingredients: [
            {
              name: 'Omena, kuivattu',
              mass: 100,
              kcal: 270,
              protein: 0.89,
              carbohydrate: 60.2,
              fat: 0.32
            },
            {
              name: 'Jauheliha, broilerin',
              mass: 150,
              kcal: 112,
              protein: 19.27,
              carbohydrate: 0,
              fat: 3.87
            },
            {
              name: 'Riisi, pitkäjyväinen',
              mass: 80,
              kcal: 366,
              protein: 8.13,
              carbohydrate: 79,
              fat: 1.03
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('adding meal with empty ingredients', done => {
      agent
        .post('/api/meals/new')
        .send({
          date: '2018-04-04T10:00:00+03:00',
          name: 'Aamiainen',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it.skip('adding meal with missing ingredient param', done => {
      agent
        .post('/api/meals/new')
        .send({
          date: '2018-04-04T10:00:00+03:00',
          name: 'Aamiainen',
          ingredients: [
            {
              name: 'Omena, kuivattu',
              mass: 100,
              protein: 0.89,
              carbohydrate: 60.2,
              fat: 0.32
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it.skip('adding meal with missing date', done => {
      agent
        .post('/api/meals/new')
        .send({
          name: 'Aamiainen',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it.skip('adding meal with malformed date', done => {
      agent
        .post('/api/meals/new')
        .send({
          name: 'Aamiainen',
          date: '2018-0g4-0d4T10:00:00+03:00',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it.skip('adding meal with missing name', done => {
      agent
        .post('/api/meals/new')
        .send({
          date: '2018-04-04T10:00:00+03:00',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it.skip('adding meal with missing ingredients', done => {
      agent
        .post('/api/meals/new')
        .send({
          name: 'Aamiainen',
          date: '2018-04-04T10:00:00+03:00'
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it.skip('adding meal with extra property', done => {
      agent
        .post('/api/meals/new')
        .send({
          name: 'Aamiainen',
          date: '2018-04-04T10:00:00+03:00',
          additional: 'property',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe('GET /api/meals', () => {
    it('getting all meals', done => {
      agent.get('/api/meals').end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.count.should.be.a('number');
        res.body.meals.should.be.a('array');
        // res.body.meals[0].should.be.a('object');
        // res.body.meals[0].name.should.be.a('string');
        // res.body.meals[0].date.should.be.a('string');
        // res.body.meals[0].ingredients.should.be.a('array');
        done();
      });
    });
  });
});
