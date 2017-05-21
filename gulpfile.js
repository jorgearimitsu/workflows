var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    browserify = require('gulp-browserify'),

    paths = {
      coffees: [
        'components/coffee/tagline.coffee'
      ],

      scripts: [
        'components/scripts/rclick.js',
        'components/scripts/pixgrid.js',
        'components/scripts/tagline.js',
        'components/scripts/template.js'
      ],

      script: 'components/scripts',

      sass: 'components/sass',

      css: 'builds/development/css',

      images: 'builds/development/images',

      js: 'builds/development/js',

      build: 'builds/development'
    };

gulp.task('coffee', function() {
  gulp.src(paths.coffees)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest(paths.script));
});

gulp.task('js', function() {
  gulp.src(paths.scripts)
  .pipe(concat('script.js'))
  .pipe(browserify())
  .pipe(gulp.dest(paths.js));
});

gulp.task('compass', function() {
  gulp.src('components/sass/style.scss')
    .pipe(compass({
      sass: paths.sass,
      image: paths.images,
      style: 'expanded'
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(paths.css));
});

gulp.task('watch', function() {
  gulp.watch(paths.coffees, ['coffee']);
  gulp.watch(paths.script, ['js']);
  gulp.watch(paths.sass, ['compass']);
});

gulp.task('default', ['coffee', 'js', 'compass', 'watch']);