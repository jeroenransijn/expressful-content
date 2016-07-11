'use strict';
/**
 * Extends an object by parsing the file
 * Note that this based on side effects
 *
 * @example global: __extend: 'global.cson' => global: brandName: 'Expressful'
 * @param {object} parent
 * @param {string} key -- is always '__extend'
 * @param {function} transform
 * @param {object} mixins
 * @param {string} dirname
 */
function extend (parent, key, transform, mixins, dirname) {
	// HACK: make the require work, probably circular dependency issue
	const parseFile = require('./parse-file');
  const contents = parseFile(dirname, parent[key], mixins);

  Object.keys(contents)
    .forEach((newKey) => {
      if ( ! parent.hasOwnProperty(newKey)) {
        parent[newKey] = contents[newKey];
      }
    });

  delete parent[key];
}

module.exports = extend;
