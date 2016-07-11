'use strict';
const fs = require('fs');
const path = require('path');

/**
 * Lists the content of all the file in the directory as an array
 * parent[key] should be an object: { directory: './blog', ?as: 'posts' }
 * - directory -- the relative directory seen from the file
 * - as -- optionally pass property name it should put back, defaults to 'list'
 *
 * @example __list: directory: './blog', as: 'posts' => posts: [{ ... }, { ... }]
 * @param {object} parent
 * @param {string} key -- is always '__list'
 * @param {function} transfrom
 * @param {object} mixins
 * @param {string} dirname
 */
function list (parent, key, transform, mixins, dirname) {
  // HACK: make the require work, probably circular dependency issue
  const parseFile = require('./parse-file');
  const propertyName = parent[key].as;
  const listDirname = path.join(dirname, parent[key].directory);

  delete parent[key];

  parent[propertyName || 'list'] = fs.readdirSync(listDirname)
    .sort().map((fileName) => {
      return parseFile(listDirname, fileName, mixins)
    });
}

module.exports = list;
