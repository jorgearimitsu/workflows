var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect');

    paths = {
      scripts: {
        dir: 'components/scripts',

        build: 'builds/development/js',

        files: 'components/scripts/*.js',

        coffees: 'components/coffee/*.coffee'
      },

      sass: {
        dir: 'components/sass',

        files: 'components/sass/*.scss'
      },

      build: 'builds/development',

      css: 'builds/development/css',

      images: 'builds/development/images'
    };

gulp.task('connect', function() {
  connect.server({
    root: paths.build,
    livereload: true
  });
});

gulp.task('coffee', function() {
  gulp.src(paths.scripts.coffees)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest(paths.scripts.dir));
});

gulp.task('js', function() {
  gulp.src(paths.scripts.files)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest(paths.scripts.build))
    .pipe(connect.reload());
});

gulp.task('compass', function() {
  gulp.src('components/sass/style.scss')
    .pipe(compass({
      sass: paths.sass.dir,
      image: paths.images,
      style: 'expanded'
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(paths.css))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts.coffees, ['coffee']);
  gulp.watch(paths.scripts.files, ['js']);
  gulp.watch(paths.sass.files, ['compass']);
});

gulp.task('default', ['connect', 'coffee', 'js', 'compass', 'watch']);