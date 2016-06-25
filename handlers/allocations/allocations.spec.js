'use strict';

const request = require('co-request');
const config = require('config');
const port = config.get('server').port;
const host = config.get('server').host;
const protocol = config.get('server').protocol;
const apiKey = config.get('testApiKey');
const should = require('should');
const sinon = require('sinon');
const Allocate = require('./allocateModel');

function getURL(path){
    return `${protocol}://${host}:${port}${path}`;
};

describe('Allocations API', function(){

  describe('POST / Allocate asset to user', function() {

    it('throws if not full body not present', function* () {
      const response = yield request({
        method: 'post',
        url: getURL('/allocations/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {asset_id: 1, start: '2018-08-30', finish: '2018-09-30'}
      });

      should.equal(response.statusCode, 422);
    });

    it('throws if wrong date format', function* () {
      const response = yield request({
        method: 'post',
        url: getURL('/allocations/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {user_id:1, asset_id: 1, start: '2016-08-35', finish: '2016-09-30'}
      });

      should.equal(response.statusCode, 422);
      should.equal(response.body, 'Wrong dates format');
    });

    it('throws if start date more or equal then finish date', function* () {
      const response = yield request({
        method: 'post',
        url: getURL('/allocations/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {user_id:1, asset_id: 1, start: '2018-08-30', finish: '2018-07-30'}
      });

      should.equal(response.statusCode, 422);
      should.equal(response.body, 'Start date more or equal then finish date');
    });

    it('throws if Start date less then current date', function* () {
      const response = yield request({
        method: 'post',
        url: getURL('/allocations/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {user_id:1, asset_id: 1, start: '2011-05-30', finish: '2018-07-30'}
      });

      should.equal(response.statusCode, 422);
      should.equal(response.body, 'Start date less then current date');
    });

    it('throws if asset not found', function* () {
      const response = yield request({
        method: 'post',
        url: getURL('/allocations/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {user_id:1, asset_id: 133, start: '2018-06-30', finish: '2018-07-30'}
      });

      should.equal(response.statusCode, 404);
      should.equal(response.body, 'Asset not found');
    });

    it('throws if user not found', function* () {
      const response = yield request({
        method: 'post',
        url: getURL('/allocations/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {user_id:999, asset_id: 1, start: '2018-06-30', finish: '2018-07-30'}
      });

      should.equal(response.statusCode, 404);
      should.equal(response.body, 'User not found');
    });

    it('throws if finish data allocated', function* () {
      const response = yield request({
        method: 'post',
        url: getURL('/allocations/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {user_id:1, asset_id: 2, start: '2018-06-30', finish: '2018-07-09'}
      });

      should.equal(response.statusCode, 424);
      should.equal(response.body, 'Asset already allocated');
    });

    it('throws if start data allocated', function* () {
      const response = yield request({
        method: 'post',
        url: getURL('/allocations/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {user_id:1, asset_id: 2, start: '2018-07-11', finish: '2018-07-15'}
      });

      should.equal(response.statusCode, 424);
      should.equal(response.body, 'Asset already allocated');
    });

    it('should be allocated', function* () {
      const response = yield request({
        method: 'post',
        url: getURL('/allocations/'),
        json: true,
        headers: {'api-key': apiKey},
        body: {user_id:1, asset_id: 2, start: '2018-07-13', finish: '2018-07-15'}
      });

      should.equal(response.statusCode, 200);
      should.exist(response.body.allocation_id);
    });
  });

  describe('PUT /:allocateById Update allocation', function() {
    it('throws if allocateById not exists', function* () {
      const response = yield request({
        method: 'put',
        url: getURL('/allocations/' + 999),
        json: true,
        headers: {'api-key': apiKey},
        body: {start: '2018-07-13', finish: '2018-07-20'}
      });

      should.equal(response.statusCode, 404);
    });

    it('throws if not full body not present', function* () {
      const response = yield request({
        method: 'put',
        url: getURL('/allocations/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {finish: '2018-07-20'}
      });

      should.equal(response.statusCode, 422);
      should.equal(response.body, 'Nothing to update');
    });

    it('throws if wrong date format', function* () {
      const response = yield request({
        method: 'put',
        url: getURL('/allocations/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {start: '2016-08-35', finish: '2016-09-30'}
      });

      should.equal(response.statusCode, 422);
      should.equal(response.body, 'Wrong dates format');
    });

    it('throws if start date more or equal then finish date', function* () {
      const response = yield request({
        method: 'put',
        url: getURL('/allocations/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {start: '2018-08-30', finish: '2018-07-30'}
      });

      should.equal(response.statusCode, 422);
      should.equal(response.body, 'Start date more or equal then finish date');
    });

    it('throws if Start date less then current date', function* () {
      const response = yield request({
        method: 'put',
        url: getURL('/allocations/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {start: '2011-05-30', finish: '2018-07-30'}
      });

      should.equal(response.statusCode, 422);
      should.equal(response.body, 'Start date less then current date');
    });

    it('throws if finish data allocated', function* () {
      const response = yield request({
        method: 'put',
        url: getURL('/allocations/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {start: '2018-06-30', finish: '2018-07-09'}
      });

      should.equal(response.statusCode, 424);
      should.equal(response.body, 'Asset already allocated');
    });

    it('throws if start data allocated', function* () {
      const response = yield request({
        method: 'put',
        url: getURL('/allocations/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {start: '2018-07-11', finish: '2018-07-15'}
      });

      should.equal(response.statusCode, 424);
      should.equal(response.body, 'Asset already allocated');
    });

    it('should be update', function* () {
      const response = yield request({
        method: 'put',
        url: getURL('/allocations/' + 3),
        json: true,
        headers: {'api-key': apiKey},
        body: {start: '2018-07-01', finish: '2018-07-07'}
      });

      should.equal(response.statusCode, 200);
      should.exist(response.body.allocation_id);
    });
  });

  describe('DELETE /:allocateById delete allocation', function() {
    it('remove allocation', function* () {

      const response = yield request({
        method: 'delete',
        url: getURL('/allocations/' + 3),
        headers: {'api-key': apiKey}
      });

      should.equal(response.statusCode, 200);
      const allocation = yield Allocate.findById(3);
      should.ok(!allocation);
    });

    it('returns 404 if the allocation does not exist', function* () {
      const response = yield request({
        method: 'delete',
        url: getURL('/allocations/' + 123123),
        headers: {'api-key': apiKey}
      });

      should.equal(response.statusCode, 404);
    });
  });

  describe('GET /user/:userById', function () {
    it('returns 404 if the user does not exist', function* () {
      const response = yield request({
        method: 'get',
        url: getURL('/allocations/user/' + 123123),
        headers: {'api-key': apiKey}
      });

      should.equal(response.statusCode, 404);
    });

    it('should get by filter for certain user', function* () {
      const response = yield request({
        method: 'get',
        url: getURL('/allocations/user/' + 1),
        headers: {'api-key': apiKey}
      });

      should.equal(response.statusCode, 200);
      should.equal(JSON.parse(response.body).length, 1);
    });
  });

  describe('GET /user/:assetById', function () {
    it('returns 404 if the asset does not exist', function* () {
      const response = yield request({
        method: 'get',
        url: getURL('/allocations/asset/' + 123123),
        headers: {'api-key': apiKey}
      });

      should.equal(response.statusCode, 404);
    });

    it('should get by filter for certain asset', function* () {
      const response = yield request({
        method: 'get',
        url: getURL('/allocations/asset/' + 1),
        headers: {'api-key': apiKey}
      });

      should.equal(response.statusCode, 200);
      should.equal(JSON.parse(response.body).length, 1);
    });
  });

  it('GET /assigned should get full list for assigned', function* () {
    const response = yield request({
      method: 'get',
      url: getURL('/allocations/assigned/'),
      headers: {'api-key': apiKey}
    });

    should.equal(response.statusCode, 200);
    should.equal(JSON.parse(response.body).length, 2);
  });

});