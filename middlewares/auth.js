'use strict';

const crypto = require('crypto');
const allowedList = ['DenisCompany', 'bulbthings'];
const hashedList = allowedList.map(e => crypto.createHash('md5').update(e).digest('hex'));

module.exports = function* (next) {
  const apiKey = this.request.header['api-key'];

  if (apiKey && hashedList.includes(apiKey)) yield* next;
  else {
    this.status = 403;
    this.body = {status: 403, message: 'You do not have access'};
  }
   
};