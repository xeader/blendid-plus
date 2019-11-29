/*
 * Xeader Studios
 *
 * NOTICE OF LICENCE
 *
 * This source file is subject to the EULA
 * that is bundled with this package in the file LICENSE.txt
 * It is also available through th world-wide-web at this URL:
 * https://xeader.com/LICENCE-CE.txt
 *
 * @category blendid-plus
 * @package blendid-plus
 *
 * @author Antonio Gatta <a.gatta@xeader.com>
 * @url http://xeader.com
 * @copyright Copyright (c) 2019 Xeader Studios
 * @license All right reserved
 */
const {VueLoaderPlugin} = require('vue-loader');
const projectPath = require('@xeader/blendid-plus/gulpfile.js/lib/projectPath');
const util = require('util');
const globule = require('globule');
const path = require('path');
const fs = require('fs');
const types = require('node-sass').types;

const svg = function (buffer) {
  var svg = buffer.toString()
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/\#/g, '%23')
    .replace(/\"/g, "'");

  return '"data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '"';
};

const img = function (buffer, ext) {
  return '"data:image/' + ext + ';base64,' + buffer.toString('base64') + '"';
};

const tree = function (pattern) {
  let tree = [];
  let files = globule.find(pattern);
  let groups = [];
  files.forEach(filePath => {
    let filename = path.basename(filePath);
    let html = filename.replace('njk', 'html');
    let name = slugFunction(filename.replace('.njk', ''));

    if (html[0] === '_') return;

    let group = '';
    if (filename.indexOf('--') >= 0) {
      group = slugFunction(filename.split('--')[0]);
      // name = slugFunction(filename.split('--')[1].replace('.njk', ''));
      if (groups.indexOf(group) === -1) {
        groups.push(group);
      }
    }

    tree.push({
      name: name,
      path: filePath,
      group: group,
      fileName: filename,
      html: html
    })
  });

  tree.forEach((file, index) => {
    if (groups.indexOf(file.name) !== -1) {
      tree[index].group = file.name;
    }
  });

  return tree;
};

const slugFunction = function (str) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return str.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
};

const deslugFunction = function (str) {
  return str.replace('-and-', ' & ').replace('--', '-').replace('-', ' ');
};

module.exports = {
  html: {
    dataFunction: function (file) {
      const dataPath = projectPath(PATH_CONFIG.src, PATH_CONFIG.html.src, TASK_CONFIG.html.dataFile);
      let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      data.__project = {
        "PATH_CONFIG": util.inspect(PATH_CONFIG),
        "TASK_CONFIG": util.inspect(TASK_CONFIG),
        "PACKAGE": require('../package.json'),
        "TREE": tree(projectPath(PATH_CONFIG.src, PATH_CONFIG.html.src, '*.njk'))
      };
      return data
    },
    nunjucksRender: {
      manageEnv: function (env) {
        require(projectPath(PATH_CONFIG.src, PATH_CONFIG.html.src, './nunjucks'))(env);
      }
    }
  },
  images: true,
  fonts: true,
  static: true,
  svgSprite: true,
  ghPages: true,
  stylesheets: {
    autoprefixer: {
      overrideBrowserslist: [
        "last 1 version",
        "> 1%",
        "maintained node versions",
        "not dead"
      ]
    },
    sass: {
      indentedSyntax: false,
      includePaths: [
        "./node_modules",
      ],
      functions: {
        'inline-image($file)': function (file) {
          const relativePath = './' + file.getValue(),
            filePath = projectPath(PATH_CONFIG.src, relativePath),
            ext = filePath.split('.').pop(),
            data = fs.readFileSync(filePath),
            buffer = new Buffer(data),
            str = ext === 'svg' ? svg(buffer, ext) : img(buffer, ext);

          return types.String(str);
        }
      }
    }
  },

  javascripts: {
    entry: {
      // files paths are relative to
      // javascripts.dest in path-config.json
      app: ["./app.js"]
    },
    loaders: [
      {
        test: /\.vue$/,
        use: [
          { loader: "vue-loader" },
          { loader: "vue-style-loader" },
          { loader: "vue-template-compiler" }
        ]
      }
    ],
    customizeWebpackConfig: function(webpackConfig, env, webpack) {
      webpackConfig.plugins.push(new VueLoaderPlugin());

      return webpackConfig;
    }
  },

  browserSync: {
    server: {
      // should match `dest` in
      // path-config.json
      baseDir: 'public'
    }
  },

  production: {
    rev: false
  }
};
