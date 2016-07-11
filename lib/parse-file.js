'use strict';
const path = require('path');
const fs = require('fs');
const CSON = require('cson');
const transform = require('./transform');

/**
 * Parses a json file and transforms it with mixins
 *
 * @example parseFile('./content/homepage.cson'); => { ... }
 * @param {string} dirname -- this makes extends work
 * @param {string|array} filePath -- should have json or cson extension
 * @return {object} transform parsed file
 */
function parseFile (dirname, filePath, mixins) {
  if (typeof filePath === 'string') {
    const completePath = path.join(dirname, filePath);

    // make dirname relative if filePath contains slashes
    dirname = relativeDirname(dirname, filePath);

    switch (extension(filePath)) {
      case 'json': return transform(parseJSONFile(completePath), mixins, dirname);
      case 'cson': return transform(CSON.parseCSONFile(completePath), mixins, dirname);
      default: throw new Error(`file extension not supported for ${filePath}`)
    }
  } else if (Array.isArray(filePath)) {
    return Object.assign.apply(null,
      filePath.map((x) => parseFile(dirname, x, mixins)));
  } else {
    throw new Error(`filePath '${filePath}' should be a string or array.`);
  }
}

/**
 * Returns the complete dirname
 *
 * @private
 * @example relativeDirname('/content/', /blog/post.cson); => '/content/blog/'
 * @param {string} dirname
 * @param {string} filePath
 */
function relativeDirname (dirname, filePath) {
  const arr = filePath.split('/');
  return path.join(dirname, arr.slice(0, arr.length - 1).join('/'));
}

/**
 * @private
 * @param {string} str
 * @return {string} the extension of a filePath
 */
function extension (str) {
  const arr = str.split('.');
  return arr[arr.length - 1];
}

/**
 * @private
 * @param {string} filePath
 * @return {object} parsed json file
 */
function parseJSONFile (filePath) {
  return JSON.parse(fs.readFileSync(filePath, { extension: 'utf-8' }));
}

module.exports = parseFile;
