'use strict';

const pg = require('pg');
const config = require('config');
const dbConfig = config.get('dbConfig');

module.exports = () => {
  return new Promise((resolve, reject) => {
    const db = new pg.Pool(dbConfig);

    db.connect((err, client, done) => {
      if(err) {
        reject('error fetching client from pool');
      }

      resolve(client);
    });
  });
}