// Base
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
// Fixers
var plumber = require('gulp-plumber');
var cp = require('child_process');
var notify = require("gulp-notify");
// Optimizers
var uncss = require('gulp-uncss');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
// Deployment
var ghPages = require('gulp-gh-pages');


var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Build the Jekyll Site 
gulp.task('jekyll-build', function(done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {
            stdio: 'inherit'
        })
        .on('close', done);
});

// Rebuild Jekyll & do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
    browserSync.reload();
});


// Wait for jekyll-build, then launch the Server
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

// Compiles files sass to css
gulp.task('sass', function() {
    return gulp.src('_scss/main.scss')
        .pipe(sass({
            sourceComments: 'map',
            sourceMap: 'sass',
            outputStyle: 'nested'
        }).on('error', sass.logError))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(gulp.dest('css'));
    });

// Watch scss files for changes & recompile
// Watch html/md files, run jekyll & reload BrowserSync
gulp.task('watch', function() {
    gulp.watch('_scss/**/*.scss', ['sass']);
    gulp.watch(['*.html', '_config.yml', 'components/**/*.html', '_layouts/*.html', '_includes/**/*.html', '_posts/*', 'js/*.js'], ['jekyll-rebuild']);
});


// minify-css: runs sass to compile and produce main.css, then minifies
// * Note * see 'optimize' task below 
gulp.task('minify-css', function() {
  return gulp.src('_site/css/*.css')
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(gulp.dest('_site/css'));
});

// prefix-css: prefixes rules that depend on browser prefixes
// * Note * see 'optimize' task below 
gulp.task('prefix-css', function () {
    return gulp.src('_site/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 6 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('_site/css'));
});

// uncss: looks through html files in _site and removes unused css from main.css
// * Note * see 'optimize' task below 
gulp.task('uncss', function () {
    return gulp.src('css/*.css')
        .pipe(sass())
        .pipe(uncss({
            html: ['_site/**/*.html']
        }))
        .pipe(gulp.dest('_site/css'))
});

// uglify: minifies javascript
// * Note * see 'optimize' task below 
gulp.task('uglify', function() {
    gulp.src('_site/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('_site/js'))
});


// minify-html: builds site, then minifies html in _site folder 
// * Note * this won't run if you have code documentation such as escaping html characters
gulp.task('minify-html', ['jekyll-build'], function() {
    return gulp.src('_site/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('_site'))
});

// ghpages: deploys _site directory to github pages branch
// * Note * see 'deploy' task below
gulp.task('ghpages', function() {
  return gulp.src('_site/**/*')
    .pipe(ghPages());
});

// gulp: run `gulp` to compile html, sass, and initiate BrowserSync
gulp.task('default', ['browser-sync', 'watch']);


// deploy: builds, optimizes and deploys to github pages branch
gulp.task('deploy', function(callback) {
  runSequence('sass', 'jekyll-build', 'uncss', 'prefix-css', 'minify-css', 'uglify', 'ghpages',
              callback);
});

// optimize: builds site, optimizes css, and js for production
gulp.task('optimize', function(callback) {
  runSequence('sass', 'jekyll-build', 'uncss', 'prefix-css', 'minify-css', 'uglify',
              callback);
});
