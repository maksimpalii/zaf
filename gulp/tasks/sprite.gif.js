'use strict';

module.exports = function() {

    $.gulp.task('sprite:gif', function () {
        return $.gulp.src('./source/sprite/*.gif')
            .pipe($.spritesmith({
                imgName: 'sprite.gif',
                cssName: 'sprite-gif.css'
            }))
             .pipe($.gulp.dest($.config.root + '/assets/img/sprite'));
    });

};
