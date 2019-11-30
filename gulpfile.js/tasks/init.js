let gulp = require("gulp");
let log = require("fancy-log");
let colors = require("ansi-colors");
let projectPath = require("../lib/projectPath");
let merge = require("merge-stream");

gulp.task("init", function() {
  const rootStream = gulp
    .src(["root/*", "root/.*"])
    .pipe(gulp.dest(process.env.PWD));

  const defaultStream = gulp
    .src(["extras/default/**/*", "extras/default/**/.*"])
    .pipe(gulp.dest(projectPath()));

  const srcStream = gulp
    .src(["src/**/*", "src/**/.*"])
    .pipe(gulp.dest(projectPath(PATH_CONFIG.src)));

  log(colors.green("Generating default Blendid project files"));
  log(
    colors.yellow(`
To start the dev server:
`),
    colors.magenta(`
yarn run blendid
`)
  );
  log(colors.green("Generating default Blendid project files"));

  log(
    colors.grey(`
******* For ESLint: yarn add eslint eslint-config-prettier eslint-loader eslint-plugin-prettier prettier -D
      `)
  );

  return merge(rootStream, defaultStream, srcStream);
});
