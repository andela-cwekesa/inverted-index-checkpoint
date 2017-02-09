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
  }, {
    key: 'isJSON',
    value: function isJSON(fileData) {
      fileData = typeof fileData !== 'string' ? JSON.stringify(fileData) : fileData;
      try {
        return JSON.parse(fileData);
      } catch (error) {
        return false;
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
     * Method which accepts `required` params for indexing a
     * json file.
     * it stores indices in an object ==> this.indices.
     *
     * @param {array} words
     * @param {string} file
     * @param {number} id
     */

  }, {
    key: 'checkIndex',
    value: function checkIndex(words, file, id) {
      var _this = this;

      words.forEach(function (word) {
        var theword = _this.sanitizeInput(word);
        if (!_this.indices[file][theword]) {
          _this.indices[file][theword] = new Set();
          _this.indices[file][theword].add(id);
        }
        _this.indices[file][theword].add(id);
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
        swal({
          title: 'Empty File!',
          text: 'It looks like you uploaded an empty JSON file.',
          type: 'error',
          confirmButtonText: 'Close',
          timer: 2500
        });
      } else if (check.type === 'fileValid') {
        var filesToBeIndexed = fileContents.files;
        this.indices[fileContents.name] = {
          fileLen: filesToBeIndexed.length
        };
        filesToBeIndexed.forEach(function (doc, index) {
          var splitTextAndTitle = (doc.text + ' ' + doc.title).split(' ');
          _this2.checkIndex(splitTextAndTitle, fileContents.name, index);
        });
        return check;
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
      }
      return this.indices;
    }

    /**
     * @method searchFeedback
     *
     * takes terms of array and fetch result of each token.
     *
     * @param {array} termsArray
     * @param {object} file
     * @returns {object} searchResults
     */

  }, {
    key: 'searchFeedback',
    value: function searchFeedback(termsArray, file) {
      var searchResults = {};
      termsArray.forEach(function (term, index) {
        if (file.hasOwnProperty(term)) {
          searchResults[termsArray[index]] = Array.from(file[term]);
        } else {
          searchResults[term] = [];
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
      var _this3 = this;

      var searchResults = {};
      var termsArray = [];
      termsArray = this.sanitizeInput(arguments.length <= 1 ? undefined : arguments[1]);
      if (!currFile) {
        Object.keys(this.indices).forEach(function (fileName) {
          searchResults[fileName] = _this3.searchFeedback(termsArray, _this3.indices[fileName]);
        });
      } else {
        try {
          var file = this.indices[currFile];
          searchResults[currFile] = this.searchFeedback(termsArray, file);
        } catch (e) {
          return null;
        }
      }
      return searchResults;
    }
  }]);

  return Index;
}();
// export { Index as default };


window.Index = Index;
// module.exports = Index;
exports.default = Index;

},{}]},{},[1]);
