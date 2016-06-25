'use strict'

const Router = require('koa-router');
const _ = require('lodash');
const Asset = require('./assetModel');

const router = new Router({ prefix: '/assets' });

router
  .param('assetById', function*(id, next) {
    id = parseInt(id, 10);

    if (!id) this.throw(404);

    this.assetById = yield Asset.findById(id);

    if (!this.assetById) this.throw(404);

    yield* next;
  })
  .get('/', function*(next) {
    this.body = yield Asset.all();
  })
  .get('/:assetById', function*(next) {
    this.body = this.assetById;
  })
  .post('/', function*(next) {
    const body = this.request.body;
    const type = body.type;
    const attributes = body.attributes;

    if (type && attributes &&  _.isPlainObject(attributes)) {
      this.body = yield Asset.create({type, attributes});
    } else this.throw(422);
  })
  .put('/:assetById', function*(next) {
    const body = this.request.body;
    const allowed = _.remove(Object.keys(this.assetById), el => el !== 'asset_id');
    let processingBody = {};

    _.forEach(body, (el, key) => {
      if (allowed.includes(key) && el) processingBody[key] = el;
    });

    if (_.isEmpty(processingBody)) this.throw(422, 'Nothing to update');

    this.body = yield Asset.update(processingBody, this.assetById.asset_id);
  })
  .del('/:assetById', function*(next) {
    yield Asset.delete(this.assetById.asset_id);
    this.body = this.assetById;
  });

module.exports = router;