'use strict';

const pg = require('pg');
const config = require('config');
const dbConfig = config.get('dbConfig');
const user = process.env.USER || dbConfig.user;

module.exports = () => {
  return new Promise((resolve, reject) => {
    const db = new pg.Pool(Object.assign({}, dbConfig, {user: user}));

    db.connect((err, client, done) => {
      if(err) {
        reject('error fetching client from pool');
      }

      resolve(client);
    });
  });
}