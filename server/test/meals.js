const app = require('../app');
const testUser = require('../config/testUser');

const mongoose = require('mongoose');
const Meal = mongoose.model('meals');
const User = mongoose.model('users');

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.should();
chai.use(chaiHttp);

// Will not close the server automatically
const agent = chai.request.agent(app);

// We need one meal to test update, delete
let testMealMongoId = 0;

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

  describe('POST /api/meals', () => {
    it('add meal with good properties', done => {
      agent
        .post('/api/meals')
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
          res.should.be.json;
          // Taking this id for update and delete testing
          testMealMongoId = res.body.createdMeal._id;
          done();
        });
    });
    it('add meal with zero ingredients', done => {
      agent
        .post('/api/meals')
        .send({
          date: '2018-04-04T10:00:00+03:00',
          name: 'Aamiainen',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          done();
        });
    });
    it.skip('add meal with missing property: ingredients', done => {
      agent
        .post('/api/meals')
        .send({
          name: 'Aamiainen',
          date: '2018-04-04T10:00:00+03:00'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          done();
        });
    });
    it.skip('add meal with missing property: name', done => {
      agent
        .post('/api/meals')
        .send({
          date: '2018-04-04T10:00:00+03:00',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          done();
        });
    });
    it.skip('add meal with missing property: date', done => {
      agent
        .post('/api/meals')
        .send({
          name: 'Aamiainen',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          done();
        });
    });
    it.skip('add meal with malformed property: date', done => {
      agent
        .post('/api/meals')
        .send({
          name: 'Aamiainen',
          date: '2018-0g4-0d4T10:00:00+03:00',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          done();
        });
    });
    it.skip('add meal with missing property in ingredient: kcal', done => {
      agent
        .post('/api/meals')
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
          res.should.be.json;
          done();
        });
    });
    it.skip('add meal with additional property', done => {
      agent
        .post('/api/meals')
        .send({
          name: 'Aamiainen',
          date: '2018-04-04T10:00:00+03:00',
          additional: 'property',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          done();
        });
    });
    it.skip('add meal with additional property in ingredient', done => {
      agent
        .post('/api/meals')
        .send({
          name: 'Aamiainen',
          date: '2018-04-04T10:00:00+03:00',
          ingredients: [
            {
              name: 'Omena, kuivattu',
              additional: 'property',
              mass: 100,
              protein: 0.89,
              carbohydrate: 60.2,
              fat: 0.32
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          done();
        });
    });
  });

  describe('PUT /api/meals/:id', () => {
    it('success with good properties', done => {
      agent
        .put(`/api/meals/${testMealMongoId}`)
        .send({
          date: '2018-04-05T10:00:00+03:00',
          name: 'Aamiainen',
          ingredients: [
            {
              name: 'Jauheliha, broilerin',
              mass: 666,
              kcal: 112,
              protein: 19.27,
              carbohydrate: 0,
              fat: 3.87
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          assert(res.body.ingredients[0].mass === 666);
          done();
        });
    });
    it('success with zero ingredients', done => {
      agent
        .put(`/api/meals/${testMealMongoId}`)
        .send({
          date: '2018-04-05T10:00:00+03:00',
          name: 'Aamiainen',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          done();
        });
    });
    it('success with additional property, ignores the property', done => {
      agent
        .put(`/api/meals/${testMealMongoId}`)
        .send({
          date: '2018-04-05T10:00:00+03:00',
          name: 'Aamiainen',
          blaa: 'blaa',
          ingredients: [
            {
              name: 'Omena, kuivattu',
              mass: 100,
              kcal: 270,
              protein: 0.89,
              carbohydrate: 60.2,
              fat: 0.32
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.not.have.property('blaa');
          done();
        });
    });

    it('success with additional property in ingredient-subdocument, ignores the property', done => {
      agent
        .put(`/api/meals/${testMealMongoId}`)
        .send({
          date: '2018-04-05T10:00:00+03:00',
          name: 'Aamiainen',
          ingredients: [
            {
              name: 'Omena, kuivattu',
              blaa: 'blaa',
              mass: 330,
              kcal: 270,
              protein: 0.89,
              carbohydrate: 60.2,
              fat: 0.32
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.ingredients[0].should.not.have.property('blaa');
          done();
        });
    });
    it('fails with missing property: ingredients', done => {
      agent
        .put(`/api/meals/${testMealMongoId}`)
        .send({
          date: '2018-04-05T10:00:00+03:00',
          name: 'Aamiainen'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
    it('fails with missing property: name', done => {
      agent
        .put(`/api/meals/${testMealMongoId}`)
        .send({
          date: '2018-04-05T10:00:00+03:00',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
    it('fails with missing property: date', done => {
      agent
        .put(`/api/meals/${testMealMongoId}`)
        .send({
          name: 'Aamiainen',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });

    it('fails with malformed property: date', done => {
      agent
        .put(`/api/meals/${testMealMongoId}`)
        .send({
          date: '2018-04-05T10:0fa0:00+03:00',
          name: 'Aamiainen',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
    it('fails with missing property in ingredient: kcal', done => {
      agent
        .put(`/api/meals/${testMealMongoId}`)
        .send({
          date: '2018-04-05T10:00:00+03:00',
          name: 'Aamiainen',
          ingredients: [
            {
              name: 'Omena, kuivattu',
              madss: 100,
              protein: 0.89,
              carbohydrate: 60.2,
              fat: 0.32
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });

    it('fails with malformed id', done => {
      agent
        .put('/api/meals/235233')
        .send({
          date: '2018-04-05T10:00:00+03:00',
          name: 'Aamiainen',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
    it('fails with non-existing id', done => {
      agent
        .put('/api/meals/5ac4b2a76613d34c5d9e275c')
        .send({
          date: '2018-04-05T10:00:00+03:00',
          name: 'Aamiainen',
          ingredients: []
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
  });

  describe('GET /api/meals', () => {
    it('getting all meals', done => {
      agent.get('/api/meals').end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.count.should.be.a('number');
        res.body.meals.should.be.a('array');
        res.body.meals[0].should.be.a('object');
        res.body.meals[0].name.should.be.a('string');
        res.body.meals[0].date.should.be.a('string');
        res.body.meals[0].ingredients.should.be.a('array');
        done();
      });
    });
    it('getting meals after 2018-05-02', done => {
      agent.get('/api/meals?after=2018-05-02').end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.count.should.be.a('number');
        res.body.meals.should.be.a('array');
        assert.equal(res.body.count, 0);
        done();
      });
    });
    it('getting meals before 2018-03-02', done => {
      agent.get('/api/meals?before=2018-03-02').end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.count.should.be.a('number');
        res.body.meals.should.be.a('array');
        assert.equal(res.body.count, 0);
        done();
      });
    });
  });

  describe('GET /api/meals/:id', () => {
    it('success with good id', done => {
      agent.get(`/api/meals/${testMealMongoId}`).end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.name.should.be.a('string');
        res.body.date.should.be.a('string');
        res.body.ingredients.should.be.a('array');
        done();
      });
    });
    it('fails with malformed id', done => {
      agent.get('/api/meals/235233').end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.error.should.not.be.empty;
        done();
      });
    });
    it('fails with non-existing id', done => {
      agent.get('/api/meals/5ac4b2a76613d34c5d9e275c').end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.error.should.not.be.empty;
        done();
      });
    });
  });

  describe('DELETE /api/meals/:id', () => {
    it.skip('delete meal with good id', done => {
      agent.delete(`/api/meals/${testMealMongoId}`).end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
    });
    it.skip('delete meal with malformed id', done => {
      agent.delete('/api/meals/235233').end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        done();
      });
    });
    it.skip('delete meal with non-existing id', done => {
      agent.delete('/api/meals/5ac4b2a76613d34c5d9e275c').end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        done();
      });
    });
  });
});
