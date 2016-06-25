'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha-co');
const app = require('./index');
const config = require('config');
const port = config.get('server').port;
const exit = require('gulp-exit');

function lazyRequireTask(path) {
  var args = [].slice.call(arguments, 1);
  return function(callback) {
    var task = require(path).apply(this, args);

    return task(callback);
  };
}

gulp.task('db-load', lazyRequireTask('./tasks/db-load', {}));

gulp.task('mocha', () => {
    const server = app.listen(port, () => {
      console.log(`test server listen port ${port}`);
    });

    server.on('listening', () => {
      return gulp.src('./**/*.spec.js')
        .pipe(mocha({reporter: 'spec'}))
        .pipe(exit());
    });
});

gulp.task('tests', ['db-load', 'mocha']);