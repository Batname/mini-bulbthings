'use strict';

const config = require('config');
const co = require('co');
const _ = require('lodash');
const dbConfig = config.get('dbConfig');
const dbConnect = require('../../db/connect');
const runQuery = require('../../db/runQuery');

exports.all = function* () {
  const db = yield dbConnect();
  const assets = yield runQuery(db, {string: 'select * from assets'});
  db.end();
  return assets; 
};

exports.findById = function* (id) {
  const db = yield dbConnect();
  const asset = yield runQuery(db, {string: `select * from assets where asset_id=${id}`});
  db.end();
  return asset[0]; 
};

exports.create = function* (body) {
  const keys = _.keys(body).join(',');
  const values = _.values(body).map(e => {
    return _.isPlainObject(e) ? `'${JSON.stringify(e)}'` : `'${e}'`;
  }).join(',');

  const db = yield dbConnect();
  yield runQuery(db, {string: `insert into assets(${keys}) values(${values})`});

  // refactor this query in future
  const asset = yield runQuery(db, {string: `select * from assets order by asset_id desc limit 1`});
  db.end();
  return asset[0];
}

exports.update = function* (body, id) {
  const length = Object.keys(body).length;
  let bodyString = '';
  let index = 1;

  _.forEach(body, (el, key) => {
    el = _.isPlainObject(el) ? `${JSON.stringify(el)}` : el;
    bodyString += `${key}='${el}'`;
    bodyString += (length === index) ? ' ': ', ';
    index++;
  });

  const db = yield dbConnect();
  yield runQuery(db, {string: `update assets set ${bodyString} where asset_id=${id}`});
  const asset = yield runQuery(db, {string: `select * from assets where asset_id=${id}`});

  db.end(); 

  return asset[0];
};

exports.delete = function* (id) {
  const db = yield dbConnect();
  yield runQuery(db, {string: `delete from allocations where asset_id=${id}`});
  yield runQuery(db, {string: `delete from assets where asset_id=${id};`});

  return;
};
