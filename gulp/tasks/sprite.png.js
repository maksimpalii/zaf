'use strict';

module.exports = function() {

    $.gulp.task('sprite:png', function () {
        return $.gulp.src('./source/sprite/*.png')
            .pipe($.spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite-png.css'
        }))
       .pipe($.gulp.dest($.config.root + '/assets/img/sprite'));
    });


};
