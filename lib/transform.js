'use strict';
const extend = require('./extend');
const list = require('./list');

const defaultMixins = {
  extend: extend,
  list: list
};

const MIXIN_IDENTIFIER = '__';

/**
 * Transform an object with mixins as side effects
 *
 * @example property: __mixin: * => property: mixin(property, key, transform, mixins, dirname)
 * @param {object} obj
 * @param {?object} mixins -- object with mixin functions
 * @param {?string} dirname --
 * @return {object} obj -- return for convenience, not a new object!
 */
function transform (obj, mixins, dirname) {
  mixins = mixins || {};

  Object.keys(obj).forEach((key) => {
    if (key.indexOf(MIXIN_IDENTIFIER) === 0) {
      const mixinName = key.substring(2);

      if (mixins.hasOwnProperty(mixinName)) {
        mixins[mixinName](obj, key, transform, mixins, dirname);
      } else if (defaultMixins.hasOwnProperty(mixinName)) {
        defaultMixins[mixinName](obj, key, transform, mixins, dirname);
      } else {
        if ('development' === (process.env.NODE_ENV || 'development')) {
          console.log(`(transform) warning: unknown mixin '${key}' found when parsing object`);
        }
      }
    } else if (toString.call(obj[key]) === '[object Object]') {
      obj[key] = transform(obj[key], mixins, dirname);
    }
  });

  return obj;
}

module.exports = transform;
