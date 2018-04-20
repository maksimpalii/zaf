'use strict';

global.$ = {
  package: require('./package.json'),
  config: require('./gulp/config'),
  path: {
    task: require('./gulp/paths/tasks.js'),
    jsFoundation: require('./gulp/paths/js.foundation.js'),
    cssFoundation: require('./gulp/paths/css.foundation.js'),
    app: require('./gulp/paths/app.js')
  },
  gulp: require('gulp'),
  cssunit: require('gulp-css-unit'),
  del: require('del'),
  fs: require('fs'),
  spritesmith: require('gulp.spritesmith'),
  browserSync: require('browser-sync').create(),
  gp: require('gulp-load-plugins')()
};

$.path.task.forEach(function(taskPath) {
  require(taskPath)();
});

$.gulp.task('default', $.gulp.series(
  'clean',
  $.gulp.parallel(
    'sass',
    'pug',
    'js:foundation',
    'js:process',
    'copy:image',
    'copy:config',
    'copy:font',
    'copy:javascript',
    'vendor',
    'copy:php',
    'css:foundation',
    'sprite:svg',
    'sprite:png',
    'sprite:gif'
  ),

  $.gulp.parallel(
    'watch',
    'serve'
  )
));


