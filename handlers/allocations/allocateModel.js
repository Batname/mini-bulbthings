// Allocation.allocateByTime()
// Allocation.update()
// Allocation.delete()
// Allocation.getByallocation()
// Allocation.getByAsset()
// Allocation.getByTimeRange(, filters)


'use strict';

const config = require('config');
const co = require('co');
const _ = require('lodash');
const dbConfig = config.get('dbConfig');
const dbConnect = require('../../db/connect');
const runQuery = require('../../db/runQuery');

exports.allocate = function* (body) {
  const keys = _.keys(body).join(',');
  const values = _.values(body).map(e => `'${e}'`).join(',');

  const db = yield dbConnect();
  yield runQuery(db, {string: `insert into allocations(${keys}) values(${values})`});
  const allocation = yield runQuery(db, {string: `select * from allocations where (asset_id='${body.asset_id}' and start='${body.start}')`});
  db.end();

  return allocation[0];
};

exports.checkAllocation = function* (body, id) {
  let query = id ? 
    `select * from allocations where (allocation_id != ${id} and asset_id=${body.asset_id} and start<'${body.finish}' and finish>'${body.start}')` :
    `select * from allocations where (asset_id=${body.asset_id} and start<'${body.finish}' and finish>'${body.start}')`;

  const db = yield dbConnect();
  const allocations = yield runQuery(db, {string: query});
  db.end();

  return _.isEmpty(allocations);
};

exports.findById = function* (id){
  const db = yield dbConnect();
  const allocation = yield runQuery(db, {string: `select * from allocations where allocation_id=${id}`});
  db.end();
  return allocation[0];
};

exports.update = function* (id, start, finish) {
  const db = yield dbConnect();
  yield runQuery(db, {string: `update allocations set start='${start}', finish='${finish}' where allocation_id=${id}`});
  const allocation = yield runQuery(db, {string: `select * from allocations where allocation_id=${id}`});

  db.end(); 

  return allocation[0];
};