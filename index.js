'use strict';

const koa = require('koa');
const bodyparser = require('koa-bodyparser');
const app = koa();
const config = require('config');
const port = config.get('server').port;
const auth = require('./middlewares/auth.js');
const error = require('./middlewares/error.js');

const userRouter = require('./handlers/users/userRouter');

app.use(function *(next) {
  this.type = 'application/json';
  yield* next;
});

app.use(auth);
app.use(error);

app.use(bodyparser());

app.use(userRouter.routes());

app.use(function *(){
  this.body = {status: 404, message: 'not found'};
});


app.listen(port, console.log.bind(null, `server listen port ${port}`));

