'use strict';

const Router = require('koa-router');
const _ = require('lodash');
const Allocate = require('./allocateModel');
const Asset = require('../assets/assetModel');
const User = require('../users/userModel');

const router = new Router({ prefix: '/allocations' });

router
  .param('allocateById', function*(id, next) {
    id = parseInt(id, 10);

    if (!id) this.throw(404);

    this.allocateById = yield Allocate.findById(id);

    if (!this.allocateById) this.throw(404);

    yield* next;
  })
  .param('userById', function*(id, next) {
    id = parseInt(id, 10);

    if (!id) this.throw(404);

    this.userById = yield User.findById(id);

    if (!this.userById) this.throw(404);

    yield* next;
  })
  .param('assetById', function*(id, next) {
    id = parseInt(id, 10);

    if (!id) this.throw(404);

    this.assetById = yield Asset.findById(id);

    if (!this.assetById) this.throw(404);

    yield* next;
  })
  .post('/', function*(next) {
    const body = this.request.body;
    const user_id = body.user_id;
    const asset_id = body.asset_id;
    const start = body.start; //  ISO 8601
    const finish = body.finish; //  ISO 8601

    if (!user_id || !asset_id || !start || !finish) this.throw(422);

    const startDate = new Date(start);
    const finishDate = new Date(finish);
    const now = new Date();

    if (!startDate.getTime() || !finishDate.getTime())  this.throw(422, 'Wrong dates format');
    if (+startDate >= +finishDate) this.throw(422, 'Start date more or equal then finish date');
    if (+now >= +startDate) this.throw(422, 'Start date less then current date');

    const asset = yield Asset.findById(asset_id);
    if (!asset) this.throw(404, 'Asset not found');

    const user = yield User.findById(user_id);
    if (!user) this.throw(404, 'User not found');

    const isAvalible = yield Allocate.checkAllocation({user_id, asset_id, start, finish});
    if (!isAvalible) this.throw(424, 'Asset already allocated');

    const allocation = yield Allocate.allocate({user_id, asset_id, start, finish});
    this.body = allocation;
  })
  .put('/:allocateById', function* (){

    const body = this.request.body;
    const asset_id = this.allocateById.asset_id;
    const start = body.start; //  ISO 8601
    const finish = body.finish; //  ISO 8601

    if (!start || !finish) this.throw(422, 'Nothing to update');

    const startDate = new Date(start);
    const finishDate = new Date(finish);
    const now = new Date();

    if (!startDate.getTime() || !finishDate.getTime())  this.throw(422, 'Wrong dates format');
    if (+startDate >= +finishDate) this.throw(422, 'Start date more or equal then finish date');
    if (+now >= +startDate) this.throw(422, 'Start date less then current date');

    const isAvalible = yield Allocate.checkAllocation({asset_id, start, finish}, this.allocateById.allocation_id);
    if (!isAvalible) this.throw(424, 'Asset already allocated');

    this.body = yield Allocate.update(this.allocateById.allocation_id, start, finish);
  })
  .delete('/:allocateById', function* (){
    yield Allocate.delete(this.allocateById.allocation_id);
    this.body = this.allocateById;
  })
  .get('/user/:userById', function* (){
    this.body = yield Allocate.filterByUserId(this.userById.user_id);
  })
  .get('/asset/:assetById', function* (){
    this.body = yield Allocate.filterByAssetId(this.assetById.asset_id);
  })
  .get('/assigned', function* () {
    this.body = yield Allocate.assigned();
  });

module.exports = router;

