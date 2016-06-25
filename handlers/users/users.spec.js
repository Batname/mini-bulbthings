'use strict';

const request = require('co-request');
const config = require('config');
const port = config.get('server').port;
const host = config.get('server').host;
const protocol = config.get('server').protocol;
const apiKey = config.get('testApiKey');
const should = require('should');
const sinon = require('sinon');
const User = require('./userModel');

console.log(apiKey);

function getURL(path){
    return `${protocol}://${host}:${port}${path}`;
};

describe('User REST API', function(){

  describe('POST /', function () {

    it('Should create user', function* (){
      const response = yield request({
        method: 'post',
        url: getURL('/users/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {first_name:'John', last_name: 'Smith', email: 'john@smith.com'}
      });

      should.exist(response.body.email);
    });

    it('throws if email already exists', function*() {
      const response = yield request({
        method: 'post',
        url: getURL('/users/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {first_name:'John', last_name: 'Smith', email: 'john@smith.com'}
      });

      should.equal(response.statusCode, 500);
    });

    it('throws if email not valid', function*() {
      const response = yield request({
        method: 'post',
        url: getURL('/users'),
        json: true,
        headers: {'api-key': apiKey},
        body: {first_name:'John', last_name: 'Smith', email: 'invalid'}
      });

      should.equal(response.statusCode, 422);
    });

  });

  describe('GET /:userById', function() {
    it('gets the user by id', function* (){
      const response = yield request.get({
        url: getURL('/users/' + 3),
        headers: {'api-key': apiKey}
      });

      should.equal(response.statusCode, 200);
      should.exist(JSON.parse(response.body).email);
    });

    it('returns 404 if user does not exist', function* () {
      const response = yield request.get({
        url: getURL('/users/23423424'),
        headers: {'api-key': apiKey}
      });
        should.equal(response.statusCode, 404);
    });
  });

  describe('PUT /:userById', function() {
    it('should get Nothing to update if empty body', function* (){
      const response = yield request({
        method: 'put',
        url: getURL('/users/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {}
      });

      should.equal(response.statusCode, 422);
    });

    it('should get Nothing to update if not allowed fields', function* (){
      const response = yield request({
        method: 'put',
        url: getURL('/users/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {ip: '10.10.10.10'}
      });

      should.equal(response.statusCode, 422);
    });

    it('should not update if wrong email', function* (){
      const response = yield request({
        method: 'put',
        url: getURL('/users/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {first_name: 'Denis', email: 'wrong format'}
      });

      should.equal(response.statusCode, 422);
    });

    it('should update', function* (){
      const newEmail = 'bat123123@gmail.com';
      const response = yield request({
        method: 'put',
        url: getURL('/users/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {first_name: 'Denis', email: newEmail}
      });

      should.equal(response.statusCode, 200);
      should.equal(response.body.email, newEmail);
    });
  });

  describe('DELETE /:userById', function() {
    it('removes user', function* () {

      const response = yield request({
        method: 'delete',
        url: getURL('/users/' + 3),
        headers: {'api-key': apiKey}
      });

      should.equal(response.statusCode, 200);
      const user = yield User.findById(3);
      should.ok(!user);
    });

    it('returns 404 if the user does not exist', function*() {
      const response = yield request({
        method: 'delete',
        url: getURL('/users/' + 123123),
        headers: {'api-key': apiKey}
      });

      should.equal(response.statusCode, 404);
    });
  });

  it('GET / gets all users', function* (){

    const response = yield request({
      method: 'get',
      url: getURL('/users/'),
      headers: {'api-key': apiKey}
    });

    should.equal(response.statusCode, 200);
    should.equal(JSON.parse(response.body).length, 2);

  });
});