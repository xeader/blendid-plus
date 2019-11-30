var gulp = require('gulp');
var log = require('fancy-log');
var colors = require('ansi-colors');
var projectPath = require('../lib/projectPath');
var merge = require('merge-stream');

gulp.task('init', function() {
  const rootStream = gulp
    .src(['root/*', 'root/.*'])
    .pipe(gulp.dest(process.env.PWD));

  const defaultStream = gulp
    .src(['extras/default/**/*', 'extras/default/**/.*'])
    .pipe(gulp.dest(projectPath()));

  const srcStream = gulp
    .src(['src/**/*', 'src/**/.*'])
    .pipe(gulp.dest(projectPath(PATH_CONFIG.src)));

  log(colors.green('Generating default Blendid project files'));
  log(
    colors.yellow(`
To start the dev server:
`),
    colors.magenta(`
yarn run blendid
`),
  );

  return merge(rootStream, defaultStream, srcStream);
});
