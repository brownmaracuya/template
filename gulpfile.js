const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

sass.compiler = require('node-sass');

const DEST = {
    css: './css/',
    sass: './src/sass/',
    img: ['assets/img/']
};

gulp.task('autoprefix-css', (e) => {
    gulp.src(DEST.css + '*.css')
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest(DEST.css));
    e();
});
gulp.task('sass', (e) => {
    gulp.src(DEST.sass + '*')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DEST.css))
    e();
});
gulp.task('optimizeImage', (e) => {
    gulp.src(DEST.img + '*')
        .pipe(imagemin([
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest(DEST.img))
    e();
});
gulp.task('watch', (e) => {
    gulp.watch(DEST.sass, gulp.series('sass', 'autoprefix-css'));
    e();
});


exports.default = gulp.series('sass', 'autoprefix-css');
exports.build = gulp.parallel(gulp.series('sass', 'autoprefix-css'), gulp.series('optimizeImage'));