'use strict';

module.exports = function() {
    $.gulp.task('copy:config', function() {
        return $.gulp.src('./source/config/*.*', { since: $.gulp.lastRun('copy:config') })
            .pipe($.gulp.dest($.config.root));
    });
};
