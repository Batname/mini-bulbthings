'use strict';

module.exports = function* (next) {
  try {
    yield * next;
  } catch (e) { 
    this.body = "Any server Error 500";
    this.status = 500;
    console.error(e.message, e.stack);
  }
   
};