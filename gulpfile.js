// require packages
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require ('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),


    // conditional enviroment variables
    outputSrc = 'builds/development/',
    env = process.env.NODE_ENV;

// conditional enviroment output
if ( env === 'production' ) {
  outputSrc = 'builds/production/';
}

var paths = {
  scripts: {
    coffees: 'components/coffee/*.coffee',

    src: 'components/scripts',

    files: 'components/scripts/*.js',

    json: 'builds/development/js/*.json'
  },

  sass: {
    src: 'components/sass',

    files: 'components/sass/*.scss'
  },

  build: {
    css: outputSrc + 'css',

    html: 'builds/development/*.html',

    images: 'builds/development/images',

    js: outputSrc + 'js',

    src: outputSrc
  }
};

gulp.task('connect', function() {
  connect.server({
    root: paths.build.src,
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src(paths.build.html)
    .pipe(gulpif( env === 'production',  minifyHTML() ))
    .pipe(gulpif( env === 'production', gulp.dest(outputSrc) ))
    .pipe(connect.reload());
});

gulp.task('coffee', function() {
  gulp.src(paths.scripts.coffees)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest(paths.scripts.src));
});

gulp.task('js', function() {
  gulp.src(paths.scripts.files)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif( env === 'production', uglify() ))
    .pipe(gulp.dest(paths.build.js))
    .pipe(connect.reload());
});

gulp.task('compass', function() {
  gulp.src('components/sass/style.scss')
    .pipe(compass({
      sass: paths.sass.src,
      image: paths.build.images,
      style: 'expanded'
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(paths.build.css))
    .pipe(connect.reload());
});

gulp.task('json', function() {
  gulp.src(paths.scripts.json)
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(paths.build.html, ['html']);
  gulp.watch(paths.scripts.coffees, ['coffee']);
  gulp.watch(paths.scripts.files, ['js']);
  gulp.watch(paths.scripts.json, ['json']);
  gulp.watch(paths.sass.files, ['compass']);
});

gulp.task('default', ['html', 'coffee', 'js', 'json', 'compass', 'connect', 'watch']);