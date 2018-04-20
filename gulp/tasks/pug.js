'use strict';

module.exports = function() {
  $.gulp.task('pug', function() {
    return $.gulp.src('./source/template/pages/*.pug')
      .pipe($.gp.pug({
          locals : {
              one : JSON.parse($.fs.readFileSync('./source/content/content.json', 'utf8'))
          },
          pretty: true }))
      .on('error', $.gp.notify.onError(function(error) {
        return {
          title: 'Pug',
          message:  error.message
        }
       }))
      .pipe($.gulp.dest($.config.root));
  });
};
