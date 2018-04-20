'use strict';

module.exports = function() {
    $.gulp.task('copy:javascript', function() {
        return $.gulp.src('./source/js/copy/**/*.*', { since: $.gulp.lastRun('copy:javascript') })
            .pipe($.gulp.dest($.config.root + '/assets/js'));
    });
};
