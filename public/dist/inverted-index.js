(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @class representing an Index. */
var Index = function () {
  /**
  * Constructor initializes indices to an empty object.
  */
  function Index() {
    _classCallCheck(this, Index);

    this.indices = {};
  }

  /**
   * @method fileCheck
   *
   * checks if file is empty, valid or object
   *
   * @param {string} fileContents
   * @returns {object}
   */


  _createClass(Index, [{
    key: 'fileCheck',
    value: function fileCheck(fileContents) {
      if (!fileContents.files) {
        return this.message = {
          type: 'fileEmpty',
          status: false,
          message: fileContents.name + ' ' + 'is empty!'
        };
      }
      if ((typeof fileContents === 'undefined' ? 'undefined' : _typeof(fileContents)) === 'object') {
        return this.message = {
          type: 'fileValid',
          status: true,
          message: fileContents.name + ' ' + ' has been indexed successfully.'
        };
      }
    }

    /**
     * @method sanitizeInput
     *
     * it sanitizes input to alphanumeric only
     *
     * @param {string} content
     * @returns {string} return characters
     */

  }, {
    key: 'sanitizeInput',
    value: function sanitizeInput(content) {
      var characters = content.trim().replace(/[^a-z0-9 ]/gi, '').toLowerCase().split(' ');
      return characters;
    }

    /**
     * @method checkIndex
     *
     * method that creates object of indices and check
     * if word has been indexed before
     *
     * @param {array} words
     * @param {string} file
     * @param {object} source
     * @param {number} id
     */

  }, {
    key: 'checkIndex',
    value: function checkIndex(words, file, source, id) {
      var _this = this;

      words.forEach(function (word) {
        var theword = _this.sanitizeInput(word);
        if (!_this.indices[file][theword]) {
          _this.indices[file][theword] = {};
          _this.indices[file][theword][id] = {
            source: source,
            file: file
          };
        }
        _this.indices[file][theword][id] = {
          source: source,
          file: file
        };
      });
    }

    /**
     * @method createIndex
     *
     * method that creates indices
     *
     * @param {object} fileContents
     * @returns {object} check
     */

  }, {
    key: 'createIndex',
    value: function createIndex(fileContents) {
      var _this2 = this;

      var check = this.fileCheck(fileContents);
      if (check.type === 'fileEmpty') {
        alert('It looks like you uploaded an empty JSON file.');
      } else if (check.type === 'fileValid') {
        var _ret = function () {
          var filesToBeIndexed = fileContents.files;
          var size = [];
          _this2.indices[fileContents.name] = {
            fileLen: function () {
              for (var i = 0; i < filesToBeIndexed.length; i += 1) {
                size.push(i);
              }
              return size;
            }()
          };
          for (var i = 0; i < filesToBeIndexed.length; i += 1) {
            var doc = filesToBeIndexed[i];
            var splittedTitle = doc.title.split(' ');
            _this2.checkIndex(splittedTitle, fileContents.name, doc, i);
            var splittedText = doc.text.split(' ');
            _this2.checkIndex(splittedText, fileContents.name, doc, i);
          }
          return {
            v: check
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    }

    /**
     * @method getIndex
     *
     * method return index of files in indices object
     *
     * @param {string} name
     * @returns {object}
     */

  }, {
    key: 'getIndex',
    value: function getIndex(name) {
      if (name && typeof name === 'string') {
        return this.indices[name];
      } else {
        return this.indices;
      }
    }

    /**
     * @method searchFeedback
     *
     * takes terms of array and fetch result of each token.
     *
     * @param {array} termsArray
     * @param {object} name
     * @returns {object} searchResults
     */

  }, {
    key: 'searchFeedback',
    value: function searchFeedback(termsArray, file) {
      var searchResults = {};
      termsArray.forEach(function (term, index) {
        if (name.hasOwnProperty(term)) {
          searchResults[termsArray[index]] = file[term];
        } else {
          alert('Sorry , but nothing matched your search.');
        }
      });
      return searchResults;
    }

    /**
     * @method searchIndex
     *
     * looks for search terms in created index
     *
     * @param {object} currFile
     * @param {array} searchTerm
     * @returns {object} searchResults
     */

  }, {
    key: 'searchIndex',
    value: function searchIndex(currFile) {
      for (var _len = arguments.length, searchTerm = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        searchTerm[_key - 1] = arguments[_key];
      }

      var searchResults = {};
      var termsArray = [];
      if (typeof searchTerm === 'string') {
        termsArray = this.sanitizeInput(searchTerm);
      } else {
        termsArray = searchTerm;
      }
      if (!currFile) {
        for (var i in this.indices) {
          searchResults[i] = this.searchFeedback(termsArray, this.indices[i]);
        }
      } else {
        try {
          var file = this.indices[currFile];
          searchResults[file] = this.searchFeedback(termsArray, file);
        } catch (e) {
          return null;
        }
      }
      return searchResults;
    }
  }]);

  return Index;
}();

window.Index = Index;

exports.default = Index;

},{}]},{},[1]);
