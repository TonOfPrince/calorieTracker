var assert = require("assert");
// var request = require('request');
var supertest = require('supertest');
var api =supertest('http://localhost:3000')
var app = require('../../brett-leibowitz')
// var server = require('../server').server;
// var expect = require('Chai').expect;

describe('POST /login', function(){
  it('should fail without proper username', function(done){
    // request(app)
    api
    .post('/login')
    // .type('urlencoded')
    .send({id:'nottj',password:'foobar'})
    // .expect('Location', '/login')
    .expect(302, done)
  })

  it('should fail without proper password', function(done){
    // request(app)
    api
    .post('/login')
    // .type('urlencoded')
    .send({id:'test',password:'baz'})
    // .expect('Location', '/login')
    .expect(302, done)
  })

  it('should succeed with proper credentials', function(done){
    // request(app)
    api
    .post('/login')
    // .type('urlencoded')
    .send({id:'test',password:'test'})
    // .expect('Location', '/')
    .expect(201, done)
  })
});
// describe('Array', function(){
//   describe('#indexOf()', function(){
//     it('should return -1 when the value is not present', function(){
//       assert.equal(-1, [1,2,3].indexOf(5));
//       assert.equal(-1, [1,2,3].indexOf(0));
//     })
//   })
// })

// describe('server', function() {
//   before(function () {
//     server.listen(3000);
//   });
//   after(function () {
//     server.close();
//   });
//   it('should respond to GET requests for /login with a 200 status code', function(done) {
//     request('http://127.0.0.1:3000/#/login', function(error, response, body) {
//       assert.equal(response.statusCode, 200);
//       done();
//     });
//   });
  // it('should respond to GET requests for /authenticate with a 200 status code', function(done) {
  //   request
  //     .post('http://127.0.0.1:3000/login', {json :{username: 'test', password: 'test'}})
  //     .on('response', function(response) {
  //       console.log(response);
  //     assert.equal(response.statusCode, 200);
  //     done();
  //     })
  //     .on('error', function(error) {
  //       console.log(error)
  //     });
  // });
//   it('should respond to GET requests for /authenticate with a 200 status code', function(done) {
//     request
//       .post('http://127.0.0.1:3000/login', {username: 'test', password: 'test'}, function(err, res, body) {
//         expect(res.statusCode).to.equal(201);
//             // expect(res.body).to.equal('wrong header');
//             done();
//       });
//   });
// });
