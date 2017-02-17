var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var historyApiFallback = require('connect-history-api-fallback');

function compile(watch) {
    var bundler = watchify(browserify('./src/index.js', { debug: true }).transform(babel));

    function rebundle() {
        bundler.bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('pirates.js'))
        .pipe(buffer())
        // .pipe(sourcemaps.init({ loadMaps: true }))
        // .pipe(uglify())
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload());
    }

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...');
            rebundle();
        });
    }

    rebundle();
}

function watch() {
    return compile(true);
}

function doConnect(){
    connect.server({
        root: __dirname,
        livereload: true
    });
}

gulp.task('connect', function() { doConnect(); });
gulp.task('watch', function() { watch(); });

gulp.task('default', ['connect', 'watch']);