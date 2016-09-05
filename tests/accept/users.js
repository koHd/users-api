var logger = require('winston');
var server = require('../../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var seed = require('../../seed/seed');
var User = require('../../models/user');
var expect = require('chai').expect;

chai.should();
chai.use(chaiHttp);

var url = 'http://127.0.0.1:8001';


describe('Users', function() {

  // Before our test suite
  before(function(done) {
    // Start our app on an alternative port for acceptance tests
    server.listen(8001, function() {
      logger.info('Listening at http://localhost:8001 for acceptance tests');

      // Seed the DB with our users
      seed(function(err) {
        done(err);
      });
    });
  });

  describe('/GET users', function() {
    it('should return a list of users', function(done) {
      chai.request(url)
        .get('/users')
        .end(function(err, res) {
          res.body.should.be.a('array');
          res.should.have.status(200);
          res.body.length.should.be.eql(100);
          done();
        });
    });
  });

  describe('/GET users/:id', function() {
    it('should return a single user', function(done) {
      // Find a user in the DB
      User.findOne({}, function(err, user) {
        var id = user._id;

        // Read this user by id
        chai.request(url)
          .get('/users/' + id)
          .end(function(err, res) {
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.name.first).to.be.a('string');
            done();
          });
      });
    });
  });

  describe('/POST users/login', function() {
    it('should return a single user that logged in successfully', function(done) {
      // Find a user in the DB
      User.findOne({}, function(err, user) {

        // Log this user in with username and password
        chai.request(url)
          .post('/users/login/')
          .set('Content-Type', 'applicaiton/x-www-form-urlencoded')
          .type('form')
          .send('username='+user.username)
          .send('password='+user.password)
          .end(function(err, res) {
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.username).to.be.a('string');
            expect(res.body.username).eql(user.username);
            done();
          });
      });
    });
    it('should fail to find an unknown user', function(done) {
      chai.request(url)
        .post('/users/login')
        .set('Content-Type', 'application/x-www.form-urlencoded')
        .type('form')
        .send('username=freddyKrueger')
        .send('password=nightmare')
        .end(function(err, res) {
          res.should.have.status(404);
          expect(res.body).to.be.a('object');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).eql("No user matches the username");
          done();
        });
    });
    it('should fail to login with wrong password', function(done) {
      // Find a user in the DB
      User.findOne({}, function(err, user) {

        // Log this user in with username and password
        chai.request(url)
          .post('/users/login/')
          .set('Content-Type', 'applicaiton/x-www-form-urlencoded')
          .type('form')
          .send('username='+user.username)
          .send('password=madeuponthespot123')
          .end(function(err, res) {
            res.should.have.status(401);
            expect(res.body).to.be.a('object');
            expect(res.body.error).to.be.a('string');
            expect(res.body.error).eql("Incorrect password");
            done();
          });
      });
    });
  });
});
