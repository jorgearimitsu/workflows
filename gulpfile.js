var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect');

    paths = {
      scripts: {
        build: 'builds/development/js',

        coffees: 'components/coffee/*.coffee',

        dir: 'components/scripts',

        files: 'components/scripts/*.js',

        json: 'builds/development/js/*.json'
      },

      sass: {
        dir: 'components/sass',

        files: 'components/sass/*.scss'
      },

      build: {
        css: 'builds/development/css',

        dir: 'builds/development',

        html: 'builds/development/*.html',

        images: 'builds/development/images'
      }
    };

gulp.task('connect', function() {
  connect.server({
    root: paths.build.dir,
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src(paths.build.html)
    .pipe(connect.reload());
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