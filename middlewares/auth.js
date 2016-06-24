'use strict';

const crypto = require('crypto');
const allowedList = ['DenisCompany'];
const hashedList = allowedList.map(e => crypto.createHash('md5').update(e).digest('hex'));

module.exports = function* (next) {
  const apiKey = this.request.header['api-key'];

  if (apiKey && hashedList.includes(apiKey)) yield* next;
  else {
    this.status = 403;
    this.type = 'application/json';
    this.body = 'You do not have access';
  }
   
};