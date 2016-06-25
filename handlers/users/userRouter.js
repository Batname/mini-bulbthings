'use strict'

const Router = require('koa-router');
const _ = require('lodash');
const User = require('./userModel');
const checkEmail = require('../../modules/checkEmail');

const router = new Router({ prefix: '/users' });

router
  .param('userById', function*(id, next) {
    id = parseInt(id, 10);

    if (!id) this.throw(404);

    this.userById = yield User.findById(id);

    if (!this.userById) this.throw(404);

    yield* next;
  })
  .get('/', function*(next) {
    this.body = yield User.all();
  })
  .get('/:userById', function*(next) {
    this.body = this.userById;
  })
  .post('/', function*(next) {
    const body = this.request.body;
    const first_name = body.first_name;
    const last_name = body.last_name;
    const email = body.email;

    if (first_name && last_name && email && checkEmail(email)) {
      this.body = yield User.create({first_name, last_name, email});
    } else this.throw(422);

  })
  .put('/:userById', function*(next) {
    const body = this.request.body;
    const allowed = _.remove(Object.keys(this.userById), el => el !== 'user_id');
    let processingBody = {};

    _.forEach(body, (el, key) => {
      if (allowed.includes(key) && el) processingBody[key] =  el;
    });

    if (_.isEmpty(processingBody)) this.throw(422, 'Nothing to update');


    this.body = yield User.update(processingBody, this.userById.user_id);
  })
  .del('/:userById', function*(next) {
    yield User.delete(this.userById.user_id);
    this.body = this.userById;
  });

module.exports = router;