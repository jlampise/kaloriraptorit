const app = require('../app');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

// Will not close the server automatically
const agent = chai.request.agent(app);


describe.skip('Setting up user', () => {
  describe('GET /api/logout', () => {
    it('responds with status 404 and empty body', done => {
      agent.get('/api/logout').end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.empty;
        done();
      });
    });
  });
  describe('GET /api/current_user', () => {
    it('responds with status 200 and user object', done => {
      agent.get('/api/current_user').end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.empty;
        done();
      });
    });
  });
  describe('GET /auth/google', () => {
    it('responds with status 404 and empty body', done => {
      agent.get('/auth/google').end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.empty;
        done();
      });
    });
  });
  describe('GET /api/current_user', () => {
    it('responds with status 200 and user object', done => {
      agent.get('/api/current_user').end((err, res) => {
        res.should.have.status(200);
        res.body.should.not.be.empty;
        agent.close();
        done();
      });
    });
  });
});
