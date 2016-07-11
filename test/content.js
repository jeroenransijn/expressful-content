'use strict';
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const path = require('path');
const Content = require('../');

const mixins = {
  rename: function rename (parent, key) {
    parent['foo'] = parent[key];
    delete parent[key];
  },
  assign: function assign (parent, key, transform, mixins) {
    Object.assign(parent, transform(parent[key], mixins));
    delete parent[key];
  }
};

const CONTENT_DIRECTORY = path.join(__dirname, '/content/');

describe('Content', () => {
  it('should be an object', () => {
    assert.typeOf(Content, 'object');
  });

  describe('.transform', () => {

    it('should be a function', () => {
      assert.typeOf(Content.transform, 'function');
    });

    it('should return an object for convenience', () => {
      const result = Content.transform({});
      assert.typeOf(result, 'object');
    });

    it('should have side effects', () => {
      const obj = {
        foo: 'bar'
      };
      const result = Content.transform(obj);
      assert.equal(obj, result);
    });

    it('should execute mixins', () => {
      const obj = {
        __rename: 'bar'
      };

      Content.transform(obj, mixins);

      assert.equal(obj['foo'], 'bar');
    });

    it('should support nested object', () => {
      const obj = {
        one: {
          two: {
            __assign: { a: 'hello' },
            b: 'world'
          }
        }
      };

      const result = Content.transform(obj, mixins);

      assert.equal(obj, result);
      assert.equal(`${obj.one.two.a} ${obj.one.two.b}`, 'hello world');
    });

    it('should be able to support mixins that use transform and mixins arguments', () => {
      const obj = {
        one: {
          two: {
            __assign: { __rename: 'bar' },
            stay: 'here'
          }
        }
      };

      const result = Content.transform(obj, mixins);

      assert.equal(obj, result);
      assert.equal(obj.one.two.foo, 'bar');
      assert.equal(obj.one.two.stay, 'here');
    });
  });

  describe('.parseFile', () => {
    it('should be a function', () => {
      assert.typeOf(Content.parseFile, 'function');
    });

    it('should be able to parse a cson file', () => {
      const result = Content.parseFile(CONTENT_DIRECTORY, 'homepage.cson');

      assert.typeOf(result, 'object');
      assert.equal(result.title, 'Homepage');
    });

    it('should be able to parse a json file', () => {
      const result = Content.parseFile(CONTENT_DIRECTORY, 'about.json');

      assert.typeOf(result, 'object');
      assert.equal(result.title, 'About');
    });

    it('should be able to parse multiple files', () => {
      const result = Content.parseFile(CONTENT_DIRECTORY, [
        'global.cson',
        'about.json'
      ]);

      assert.typeOf(result, 'object');
      assert.equal(result.title, 'About');
      assert.equal(result.brandName, 'Expressful');
    });

    it('should use the default __extend mixin', () => {
      const result = Content.parseFile(CONTENT_DIRECTORY, 'contact.cson');

      assert.typeOf(result, 'object');
      assert.equal(result.title, 'Contact');
      assert.equal(result.brandName, 'Expressful');
    });

    it('should throw an error when file does not exist', () => {
      expect(
        Content.parseFile.bind(this, CONTENT_DIRECTORY, 'not-existing-file.cson')
      ).to.Throw();
    });

    it('should use the default __list: directory: "name" mixin', () => {
      const result = Content.parseFile(CONTENT_DIRECTORY, '/blog.cson');

      assert.equal(result.posts.length, 2);
    });

  });
});
