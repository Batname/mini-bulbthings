'use strict';

const config = require('config');
const co = require('co');
const _ = require('lodash');
const dbConfig = config.get('dbConfig');
const dbConnect = require('../../db/connect');
const runQuery = require('../../db/runQuery');

exports.all = function* () {
  const db = yield dbConnect();
  const users = yield runQuery(db, {string: 'select * from users'});
  db.end();
  return users; 
};

exports.findById = function* (id) {
  const db = yield dbConnect();
  const user = yield runQuery(db, {string: `select * from users where user_id=${id}`});
  db.end();
  return user[0]; 
};

exports.findByEmail = function* (email) {
  const db = yield dbConnect();
  const user = yield runQuery(db, {string: `select * from users where email='${email}'`});
  db.end();
  return user[0]; 
};

exports.create = function* (body) {
  const keys = _.keys(body).join(',');
  const values = _.values(body).map(e => `'${e}'`).join(',');

  const db = yield dbConnect();
  yield runQuery(db, {string: `insert into users(${keys}) values(${values})`});
  const user = yield runQuery(db, {string: `select * from users where email='${body.email}'`});
  db.end();
  return user[0];
}

exports.update = function* (body, id) {
  const length = Object.keys(body).length;
  let bodyString = '';
  let index = 1;

  _.forEach(body, (el, key) => {
    bodyString += `${key}='${el}'`;
    bodyString += (length === index) ? ' ': ', ';
    index++;
  });

  const db = yield dbConnect();
  yield runQuery(db, {string: `update users set ${bodyString} where user_id=${id}`});
  const user = yield runQuery(db, {string: `select * from users where user_id=${id}`});

  db.end(); 

  return user[0];
};

exports.delete = function* (id) {
  const db = yield dbConnect();
  yield runQuery(db, {string: `delete from allocations where user_id=${id}`});
  yield runQuery(db, {string: `delete from users where user_id=${id}`});

  return;
};
