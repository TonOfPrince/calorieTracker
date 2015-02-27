// var assert = require("assert");
var supertest = require('supertest');
var api = supertest('http://localhost:3000')
var jwt = require("jsonwebtoken");
var token = null;

describe('POST /login', function(){
  it('should fail without proper username', function(done){
    api
    .post('/login')
    .send({id:'nottj',password:'foobar'})
    .expect(401, done)
  })

  it('should fail without proper password', function(done){
    api
    .post('/login')
    .send({id:'test',password:'baz'})
    .expect(401, done)
  })

  it('should succeed with proper credentials', function(done){
    api
    .post('/login')
    .send({id:'test',password:'test'})
    .expect(201, done)
  })
});

describe('POST /authenticate', function(){

  var token = null;
  it('should fail without proper token', function(done){
    api
    .post('/authenticate')
    .send({token:'notthetoken'})
    .expect(401, done)
  })

  before(function(done) {
    api
      .post('/login')
      .send({id:'test',password:'test'})
      .end(function(err, res) {
        token = JSON.parse(res.text).token;
        done();
      });
  });

  it('should succeed with proper token', function(done){
    api
    .post('/authenticate')
    .send({token: token})
    .expect(200, done)
  })
});

describe('POST /saveEntry', function(){

  var token = null;

  before(function(done) {
    api
      .post('/login')
      .send({id:'test',password:'test'})
      .end(function(err, res) {
        token = JSON.parse(res.text).token;
        done();
      });
  });

  it('should fail without proper token', function(done){
    api
    .post('/saveEntry')
    .send({token:'notthetoken', date: new Date(), time: new Date(), comments: "blah", calories: 200 })
    .expect(401, done)
  })

  before(function(done) {
    api
      .post('/login')
      .send({id:'test',password:'test'})
      .end(function(err, res) {
        token = JSON.parse(res.text).token;
        done();
      });
  });

  it('should succeed with proper token', function(done){
    api
    .post('/saveEntry')
    .send({token:token, date: new Date(), time: new Date(), text: "blah", calories: 200 })
    .expect(200, done)
  })
});
