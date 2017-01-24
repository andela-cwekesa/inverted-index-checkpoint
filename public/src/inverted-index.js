/** @class representing an Index. */
class Index {
/**
* Constructor initializes container to an empty object.
*/
  constructor() {
    this.container = {};
  }

/**
 * @method fileCheck
 *
 * checks if file is empty, valid or object
 *
 * @param {string} fileContents
 * @returns {object}
 */
  fileCheck(fileContents) {
    if (!fileContents.files) {
      return this.message = {
        type: 'fileEmpty',
        status: false,
        message: `${fileContents.name} ${'is empty!'}`,
      };
    }
    if (typeof fileContents === 'object') {
      return this.message = {
        type: 'fileValid',
        status: true,
        message: `${fileContents.name} ${' has been indexed successfully.'}`,
      };
    }
    const fileString = stringify(fileContents);
    if ((JSON.parse(fileString)) === false) {
      return this.message = {
        type: 'invalidFormat',
        status: false,
        message: `${fileContents.name} ${'Invalid format.'}`,
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
  sanitizeInput(content) {
    const characters = content.trim().replace(/[^a-z0-9\ ]/gi, '').toLowerCase().split(' ');
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
  checkIndex(words, file, source, id) {
    words.forEach((word) => {
      const theword = this.sanitizeInput(word);
      if (!this.container[file][theword]) {
        this.container[file][theword] = {};
        this.container[file][theword][id] = {
          source,
          file,
        };
      }
      this.container[file][theword][id] = {
        source,
        file,
      };
    });
  }

/**
 * @method createIndex
 *
 * method that creates indices
 *
 * @param {json} fileContents
 * @returns {object} check
 */
  createIndex(fileContents) {
    const check = this.fileCheck(fileContents);
    if (check.type === 'fileEmpty') {
      alert('It looks like you uploaded an empty JSON file.');
    } else if (check.type === 'invalidFormat') {
      alert('It looks like the file is in bad format.');
    } else if (check.type === 'fileValid') {
      const indFiles = fileContents.files;
      const arr = [];
      this.container[fileContents.name] = {
        uploadedFile: (() => {
          for (let i = 0; i < indFiles.length; i += 1) {
            arr.push(i);
          }
          return arr;
        })(),
      };
      for (let i = 0; i < indFiles.length; i += 1) {
        const doc = indFiles[i];
        const splittedTitle = doc.title.split(' ');
        this.checkIndex(splittedTitle, fileContents.name, doc, i);
        const splittedText = doc.text.split(' ');
        this.checkIndex(splittedText, fileContents.name, doc, i);
      }
      return check;
    }
  }

/**
 * @method getIndex
 *
 * method return index of files in container object
 *
 * @param {string} name
 * @returns {object}
 */
  getIndex(name) {
    if (name && typeof name === 'string') {
      return this.container[name];
    } else {
      return this.container;
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
  searchFeedback(termsArray, name) {
    const searchResults = {};
    termsArray.forEach((term, index) => {
      if (name.hasOwnProperty(term)) {
        searchResults[termsArray[index]] = name[term];
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
  searchIndex(currFile, ...searchTerm) {
    const searchResults = {};
    let termsArray = [];
    if (typeof (searchTerm) === 'string') {
      termsArray = this.sanitizeInput(searchTerm);
    } else {
      termsArray = searchTerm;
    }
    if (!currFile) {
      for (const i in this.container) {
        searchResults[i] = this.searchFeedback(termsArray, this.container[i]);
      }
    } else {
      try {
        const file = this.container[currFile];
        searchResults[file] = this.searchFeedback(termsArray, file);
      } catch (e) {
        return null;
      }
    }
    return searchResults;
  }
}

// exports Index class
exports.Index = Index;
