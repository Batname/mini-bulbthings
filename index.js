'use strict';

const config = require('config');
const co = require('co');
const dbConfig = config.get('dbConfig');
const dbConnect = require('./db/connect');
const server = require('./server');

co(function* () {
  const db = yield dbConnect();
  server(db);
}).catch(console.log)