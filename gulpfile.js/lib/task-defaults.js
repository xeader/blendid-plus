const os = require('os');
const path = require('path');
const projectPath = require('./projectPath');
const pkg = require(projectPath('package.json'));

module.exports = {
  javascripts: {
    extensions: ['js', 'jsx'],
    hot: {
      reload: true,
      noInfo: false,
      quiet: true,
      react: false,
    },
    devtool: 'eval-cheap-module-source-map',
    babelLoader: {
      // "test" is derived from TASK_CONFIG.javascripts.extensions
      // "options" is derived from TASK_CONFIG.javascripts.babel
      loader: 'babel-loader',
      exclude: /node_modules/,
    },
    babel: {
      presets: [['env', { modules: false }], 'stage-1'],
    },
    development: {},
    production: {
      devtool: false,
      uglifyJsPlugin: {},
      definePlugin: {
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      },
    },
  },

  stylesheets: {
    sass: {
      includePaths: ['./node_modules'],
    },
    extensions: ['sass', 'scss', 'css', 'pcss'],
    cssnano: {
      // deprecated. configure cssnano in stylesheets.postcss.plugins
    },
    postcss: {
      plugins: [
        // Autoprefixer and cssnano are added automatically,
        // with default settings, if not given custom configuration here
      ],
      options: {},
    },
  },

  html: {
    dataFile: 'data/global.json',
    nunjucksRender: {
      envOptions: {
        watch: false,
      },
    },
    htmlmin: {
      collapseWhitespace: true,
    },
    excludeFolders: ['layouts', 'shared', 'macros', 'data'],
    extensions: ['html', 'njk', 'json'],
  },

  images: {
    extensions: ['jpg', 'png', 'svg', 'gif'],
  },

  fonts: {
    extensions: ['woff2', 'woff', 'eot', 'ttf', 'svg'],
  },

  ghPages: {
    branch: 'gh-pages',
    cacheDir: path.join(os.tmpdir(), pkg.name || 'blendid'),
  },

  svgSprite: {
    svgstore: {},
  },

  production: {
    rev: true,
  },

  additionalTasks: {
    initialize(gulp, PATH_CONFIG, TASK_CONFIG) {
      // gulp.task('myTask', function() { })
    },
    development: {
      prebuild: null,
      postbuild: null,
    },
    production: {
      prebuild: null,
      postbuild: null,
    },
  },
};
