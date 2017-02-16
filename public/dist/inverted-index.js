(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @class representing an Index
*/
var Index = function () {
  /**
  * Constructor initializes indices to an empty object
  */
  function Index() {
    _classCallCheck(this, Index);

    this.indices = {};
  }

  /**
  * @method fileCheck
  *
  * Checks if file is empty, valid or object
  *
  * @param {object} fileContents
  */


  _createClass(Index, [{
    key: 'fileCheck',
    value: function fileCheck(fileContents) {
      if (!fileContents.files) {
        return this.message = {
          type: 'fileEmpty',
          message: fileContents.name + ' ' + 'is empty!'
        };
      }
      if ((typeof fileContents === 'undefined' ? 'undefined' : _typeof(fileContents)) === 'object') {
        return this.message = {
          type: 'fileValid',
          message: fileContents.name + ' ' + ' has been indexed successfully.'
        };
      }
    }

    /**
    * @method isJSON
    *
    * Converts contents of the file into a JSON object
    *
    * @param {object} fileData
    */

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
    * It sanitizes input to alphanumeric only
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
    * @method createIndex
    *
    * Method that creates indices
    *
    * @param {string} fileName
    * @param {object} fileContents
    */

  }, {
    key: 'createIndex',
    value: function createIndex(fileName, fileContents) {
      var _this = this;

      var obj = {
        name: fileName,
        files: fileContents
      };
      var check = this.fileCheck(obj);
      if (check.type === 'fileValid') {
        var filesToBeIndexed = fileContents;
        this.indices[fileName] = {
          filesToBeIndexed: filesToBeIndexed
        };
        filesToBeIndexed.forEach(function (doc, index) {
          var splitTextAndTitle = (doc.text + ' ' + doc.title).split(' ');
          splitTextAndTitle.forEach(function (word) {
            var theword = _this.sanitizeInput(word);
            if (!_this.indices[fileName][theword]) {
              _this.indices[fileName][theword] = new Set();
              _this.indices[fileName][theword].add(index);
            }
            _this.indices[fileName][theword].add(index);
          });
        });
      }
      return check;
    }

    /**
    * @method getIndex
    *
    * Method return index of files in indices object
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
    * Takes terms of array and fetch result of each token.
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
    * Looks for search terms in created index
    *
    * @param {object} currentFile
    * @param {array} searchTerm
    * @returns {object} searchResults
    */

  }, {
    key: 'searchIndex',
    value: function searchIndex(currentFile) {
      var _this2 = this;

      var searchResults = {};
      var termsArray = [];
      termsArray = this.sanitizeInput(arguments.length <= 1 ? undefined : arguments[1]);
      if (!currentFile) {
        Object.keys(this.indices).forEach(function (fileName) {
          searchResults[fileName] = _this2.searchFeedback(termsArray, _this2.indices[fileName]);
        });
      } else {
        try {
          var file = this.indices[currentFile];
          searchResults[currentFile] = this.searchFeedback(termsArray, file);
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
