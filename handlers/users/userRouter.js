'use strict'

const Router = require('koa-router');

const router = new Router({
  prefix: '/users'
});

router
  .param('userById', function*(id, next) {
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   this.throw(404);
    // }

    // this.userById = yield User.findById(id);

    // if (!this.userById) {
    //   this.throw(404);
    // }

    this.userById = id;
    yield* next;
  })
  .get('/', function*(next) {
    this.body = 'all users';
  })
  .post('/', function*(next) {
    this.body = {message: 'Create user'};
  })
  .get('/:userById', function*(next) {
    this.body = {id: this.userById, message: 'Get user by id'};
  })
  .put('/:userById', function*(next) {
    this.body = {id: this.userById, message: 'Put user by id'};
  })
  .del('/:userById', function*(next) {
    this.body = {id: this.userById, message: 'Delete user by id'};
  })

module.exports = router;