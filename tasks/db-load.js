'use strict';

const gulp = require('gulp');
const co = require('co');
const dbConnect = require('../db/connect');
const runQuery = require('../db/runQuery');

module.exports = options => {
  return function() {

    return co(function*() {
      const client = yield dbConnect();
      yield runQuery(client, {file: 'create-tables.sql'});
      yield runQuery(client, {file: 'users.sql'});
      yield runQuery(client, {file: 'assets.sql'});
      yield runQuery(client, {file: 'allocations.sql'});
      client.end();

    }).catch(function (error) {
      console.log(error)
    });
  };
};