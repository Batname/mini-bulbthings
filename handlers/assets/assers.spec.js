'use strict';

const request = require('co-request');
const config = require('config');
const port = config.get('server').port;
const host = config.get('server').host;
const protocol = config.get('server').protocol;
const apiKey = config.get('testApiKey');
const should = require('should');
const sinon = require('sinon');
const Asset = require('./assetModel');

function getURL(path){
    return `${protocol}://${host}:${port}${path}`;
};

describe('Assets REST API', function(){
  describe('POST /', function () {

    it('Should create user', function* (){
      const response = yield request({
        method: 'post',
        url: getURL('/assets/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {type: 'Ipad2', attributes: {model: 'iphone6', os: 'ios9'}}
      });

      should.exist(response.body.type);
    });

    it('throws if type not present', function*() {
      const response = yield request({
        method: 'post',
        url: getURL('/assets/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {attributes: {model: 'iphone6', os: 'ios9'}}
      });
      should.equal(response.statusCode, 422);
    });

    it('throws if attributes not an object', function*() {
      const response = yield request({
        method: 'post',
        url: getURL('/assets/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {type: 'Ipad2', attributes: ''}
      });
      should.equal(response.statusCode, 422);
    });
  });

  describe('GET /:assetById', function() {
    it('gets the user by id', function* (){
      const response = yield request.get({
        url: getURL('/assets/' + 3),
        headers: {'api-key': apiKey}
      });

      should.equal(response.statusCode, 200);
      should.exist(JSON.parse(response.body).type);
    });

    it('returns 404 if user does not exist', function* () {
      const response = yield request.get({
        url: getURL('/assets/23423424'),
        headers: {'api-key': apiKey}
      });
        should.equal(response.statusCode, 404);
    });
  });

  describe('PUT /:assetById', function() {
    it('should get Nothing to update if empty body', function* (){
      const response = yield request({
        method: 'put',
        url: getURL('/assets/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {}
      });

      should.equal(response.statusCode, 422);
    });

    it('should get Nothing to update if not allowed fields', function* (){
      const response = yield request({
        method: 'put',
        url: getURL('/assets/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {ip: '10.10.10.10'}
      });

      should.equal(response.statusCode, 422);
    });

    it('should update', function* (){
      const newType = 'Ipad3';
      const response = yield request({
        method: 'put',
        url: getURL('/assets/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {type: newType}
      });

      should.equal(response.statusCode, 200);
      should.equal(response.body.type, newType);
    });
  });

  describe('DELETE /:assetById', function() {
    it('removes asset', function* () {

      const response = yield request({
        method: 'delete',
        url: getURL('/assets/' + 3),
        headers: {'api-key': apiKey}
      });

      should.equal(response.statusCode, 200);
      const asset = yield Asset.findById(3);
      should.ok(!asset);
    });

    it('returns 404 if the asset does not exist', function*() {
      const response = yield request({
        method: 'delete',
        url: getURL('/assets/' + 123123),
        headers: {'api-key': apiKey}
      });

      should.equal(response.statusCode, 404);
    });
  });

  it('GET / gets all assets', function* (){

    const response = yield request({
      method: 'get',
      url: getURL('/assets/'),
      headers: {'api-key': apiKey}
    });

    should.equal(response.statusCode, 200);
    should.equal(JSON.parse(response.body).length, 2);

  });

});