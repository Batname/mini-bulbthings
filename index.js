'use strict';

const koa = require('koa');
const logger = require('koa-logger');
const bodyparser = require('koa-bodyparser');
const app = koa();
const config = require('config');
const port = config.get('server').port;
const auth = require('./middlewares/auth.js');
const error = require('./middlewares/error.js');

const userRouter = require('./handlers/users/userRouter');
const assetRouter = require('./handlers/assets/assetRouter');
const allocationRouter = require('./handlers/allocations/allocationRouter');

app.use(function *(next) {
  this.type = 'application/json';
  yield* next;
});

app.use(logger());
app.use(auth);
app.use(error);

app.use(bodyparser());

app.use(userRouter.routes());
app.use(assetRouter.routes());
app.use(allocationRouter.routes());

app.use(function *(){
  this.body = {status: 404, message: 'not found'};
});

if (!module.parent) {
  app.listen(port, console.log.bind(null, `server listen port ${port}`));
} else {
  module.exports = app;
}
