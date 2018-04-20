'use strict';

module.exports = function() {
    $.gulp.task('vendor', function() {
        return $.gulp.src('./vendor/**/*.*', { since: $.gulp.lastRun('vendor') })
            .pipe($.gulp.dest($.config.root  + '/vendor/'));
    });
};
