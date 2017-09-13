/**
 * Created by xsann on 2017/8/18.
 */
var gulp = require('gulp'), //本地安装gulp所用到的地方
    babel = require('gulp-babel');

//js ES6转ES5
gulp.task('convertJS', function(){
    return gulp.src('js/index.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('js'))
});