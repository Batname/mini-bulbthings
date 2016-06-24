'use strict';

const koa = require('koa');
const app = koa();
const Router = require('koa-router');
const config = require('config');
const port = config.get('server').port;
const auth = require('./middlewares/auth.js');

module.exports = server;

function server (db) {
  app.use(auth);

  app.use(function *(){
    this.body = 'Hello World';
  });
}


app.listen(port, console.log.bind(null, `server listen port ${port}`));