'use strict';

const app = require('../app');
const testUser = require('../config/testUser');

const mongoose = require('mongoose');
const Water = mongoose.model('waters');
const User = mongoose.model('users');

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.should();
chai.use(chaiHttp);

async function cleanUpWaterDb() {
  console.log('Cleaning up database.');
  // Finding all the daily waters of the test user and deleting them.
  // Resetting default target water value.
  const user = await User.findOne({ googleId: testUser.id });
  const water = await Water.findOne({ _user: user._id });
  while (water.dailyWaters.length != 0) {
    water.dailyWaters.pop().remove();
  }
  water.defaultTarget = 0;
  await water.save();
}

describe('/api/water and /api/watertarget', () => {
  // Will not close the server automatically
  const agent = chai.request.agent(app);

  before(done => {
    console.log('Logging in as a testUser.');
    agent.get('/auth/google').end(() => {
      done();
    });
  });

  after(done => {
    console.log('Logging out. Closing agent.');
    agent.get('/api/logout').end((err, res) => {
      agent.close();
      done();
    });
  });

  describe('PUT /api/water/:date', () => {
    
    before(async () => {
      await cleanUpWaterDb();
    });
    
    after(async () => {
      await cleanUpWaterDb();
    });

    it('success with good properties (new)', done => {
      agent
        .put('/api/water/2018-09-01')
        .send({
          desiliters: 4,
          target: 5
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          assert.equal(res.body.desiliters, 4);
          assert.equal(res.body.target, 5);
          done();
        });
    });
    it('success with good properties (overwrite)', done => {
      agent
        .put('/api/water/2018-09-01')
        .send({
          desiliters: 3,
          target: 0
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          assert.equal(res.body.desiliters, 3);
          assert.equal(res.body.target, 0);
          done();
        });
    });
    it('success with zero values', done => {
      agent
        .put('/api/water/2018-09-01')
        .send({
          desiliters: 0,
          target: 0
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          assert.equal(res.body.desiliters, 0);
          assert.equal(res.body.target, 0);
          done();
        });
    });
    it('success with additional property, ignores the property', done => {
      agent
        .put('/api/water/2018-09-02')
        .send({
          desiliters: 4,
          target: 5,
          foo: 'bar'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          assert.equal(res.body.desiliters, 4);
          assert.equal(res.body.target, 5);
          res.body.should.not.have.property('foo');
          done();
        });
    });
    it('fails with negative value of property desiliters', done => {
      agent
        .put('/api/water/2018-09-03')
        .send({
          desiliters: -5,
          target: 4
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
    it('fails with negative value of property target', done => {
      agent
        .put('/api/water/2018-09-03')
        .send({
          desiliters: 4,
          target: -5
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
    it('fails with shit value of property desiliters', done => {
      agent
        .put('/api/water/2018-09-03')
        .send({
          desiliters: 'shit',
          target: 4
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
    it('fails with shit value of property target', done => {
      agent
        .put('/api/water/2018-09-03')
        .send({
          desiliters: 4,
          target: 'poop'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
    it('fails with missing property: desiliters', done => {
      agent
        .put('/api/water/2018-09-03')
        .send({
          target: 5
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
    it('fails with missing property: target', done => {
      agent
        .put('/api/water/2018-09-04')
        .send({
          desiliters: 5
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
    it('fails with malformed param', done => {
      agent
        .put('/api/water/2018-9-05')
        .send({
          desiliters: 4,
          target: 5
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
  });

  describe('GET /api/water/:date', () => {
    const DEFAULT_WATER_TARGET = 0;
    const EXISTING_WATER_DATE = '2018-10-01';
    const EXISTING_WATER = {
      date: EXISTING_WATER_DATE,
      desiliters: 3,
      target: 5
    };

    before(async () => {
      console.log('Setting up database.');
      // Finding all the daily waters of the test user and deleting them
      const user = await User.findOne({ googleId: testUser.id });
      const water = await Water.findOne({ _user: user._id });
      water.dailyWaters.push(EXISTING_WATER);
      water.defaultTarget = DEFAULT_WATER_TARGET;
      await water.save();
    });

    after(async () => {
      await cleanUpWaterDb();
    });

    it('success with good param (existing subdocument))', done => {
      agent.get(`/api/water/${EXISTING_WATER_DATE}`).end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        assert.equal(res.body.desiliters, EXISTING_WATER.desiliters);
        assert.equal(res.body.target, EXISTING_WATER.target);
        done();
      });
    });
    it('success with good param (no subdocument))', done => {
      agent.get('/api/water/2018-09-15').end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.not.have.property('_id');
        assert.equal(res.body.desiliters, 0);
        assert.equal(res.body.target, DEFAULT_WATER_TARGET);
        done();
      });
    });
    it('fails with malformed param', done => {
      agent.get('/api/water/2018-0e9-01').end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.error.should.not.be.empty;
        done();
      });
    });
  });

  describe('GET /api/water', () => {
    const EXISTING_WATER_DATE = '2018-10-01';
    const EXISTING_WATER = {
      date: EXISTING_WATER_DATE,
      desiliters: 3,
      target: 5
    };

    before(async () => {
      console.log('Setting up database.');
      // Finding all the daily waters of the test user and deleting them
      const user = await User.findOne({ googleId: testUser.id });
      const water = await Water.findOne({ _user: user._id });
      water.dailyWaters.push(EXISTING_WATER);
      await water.save();
    });

    after(async () => {
      await cleanUpWaterDb();
    });

    it('success', done => {
      agent.get('/api/water/').end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.dailyWaters.should.be.a('array');
        res.body.should.have.property('defaultTarget');
        res.body.should.have.property('_user');
        assert.equal(
          res.body.dailyWaters[0].desiliters,
          EXISTING_WATER.desiliters
        );
        assert.equal(res.body.dailyWaters[0].target, EXISTING_WATER.target);
        assert.equal(res.body.dailyWaters[0].date, EXISTING_WATER_DATE);
        done();
      });
    });
  });

  describe('/api/watertarget', () => {

    before(async () => {
      await cleanUpWaterDb();
    });
    
    after(async () => {
      await cleanUpWaterDb();
    });

    it('success - GET', done => {
      agent.get('/api/watertarget').end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('waterTarget');
        done();
      });
    });
    it('success - PUT with good properties', done => {
      agent
        .put('/api/watertarget')
        .send({
          target: 15
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          assert.equal(res.body.waterTarget, 15);
          done();
        });
    });
    it('success - PUT + GET', done => {
      agent
        .put('/api/watertarget')
        .send({
          target: 2
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          assert.equal(res.body.waterTarget, 2);

          agent.get('/api/watertarget').end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            assert.equal(res.body.waterTarget, 2);
            done();
          });
        });
    });
    it('success - PUT with additional property, ignores the property', done => {
      agent
        .put('/api/watertarget')
        .send({
          target: 13,
          foo: 'bar'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.not.have.property('foo');
          assert.equal(res.body.waterTarget, 13);
          done();
        });
    });
    it('fails - PUT with negative property: target', done => {
      agent
        .put('/api/watertarget')
        .send({
          target: -2
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
    it('success - PUT with shitty property: target', done => {
      agent
        .put('/api/watertarget')
        .send({
          target: 'shit'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.not.be.empty;
          done();
        });
    });
  });

  describe('How subdocuments exist, tests to run together sequentially.', () => {

    const DEFAULT_WATER_TARGET = 8;
    const WATER_DATE = '2018-08-01';
    const NON_ZERO_WATER = {
      date: WATER_DATE,
      desiliters: 3,
      target: 5
    };
    const ZERO_WATER = {
      date: WATER_DATE,
      desiliters: 0,
      target: DEFAULT_WATER_TARGET
    };

    before(async () => {
      await cleanUpWaterDb();
    });
    
    after(async () => {
      await cleanUpWaterDb();
    });

    it('success adding a new daily water', done => {
      agent
        .put(`/api/water/${WATER_DATE}`)
        .send(NON_ZERO_WATER)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          assert.equal(res.body.desiliters, NON_ZERO_WATER.desiliters);
          assert.equal(res.body.target, NON_ZERO_WATER.target);
          done();
        });
    });

    it('success getting the added daily water', done => {
      agent.get(`/api/water/${WATER_DATE}`).end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        assert.equal(res.body.desiliters, NON_ZERO_WATER.desiliters);
        assert.equal(res.body.target, NON_ZERO_WATER.target);
        done();
      });
    });

    it('success setting the default water target', done => {
      agent
        .put('/api/watertarget')
        .send({ target: DEFAULT_WATER_TARGET })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          assert.equal(res.body.waterTarget, DEFAULT_WATER_TARGET);
          done();
        });
    });

    it('success overwriting the new daily water with desiliters (0) and target (default)', done => {
      agent
        .put(`/api/water/${WATER_DATE}`)
        .send(ZERO_WATER)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          assert.equal(res.body.desiliters, ZERO_WATER.desiliters);
          assert.equal(res.body.target, ZERO_WATER.target);
          done();
        });
    });

    it('success getting the daily water, which is now not in db', done => {
      agent.get(`/api/water/${WATER_DATE}`).end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.not.have.property('_id');
        assert.equal(res.body.desiliters, ZERO_WATER.desiliters);
        assert.equal(res.body.target, ZERO_WATER.target);
        done();
      });
    });
  });
});
