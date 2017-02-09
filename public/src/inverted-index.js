/** @class representing an Index. */
class Index {
/**
* Constructor initializes indices to an empty object.
*/
  constructor() {
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
  }
/**
 * @method isJSON
 * @param {string} fileData
 * param
 */
  isJSON(fileData) {
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
  sanitizeInput(content) {
    const characters = content.trim().replace(/[^a-z0-9 ]/gi, '').toLowerCase().split(' ');
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
  checkIndex(words, file, id) {
    words.forEach((word) => {
      const theword = this.sanitizeInput(word);
      if (!this.indices[file][theword]) {
        this.indices[file][theword] = new Set();
        this.indices[file][theword].add(id);
      }
      this.indices[file][theword].add(id);
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
  createIndex(fileContents) {
    const check = this.fileCheck(fileContents);
    if (check.type === 'fileEmpty') {
      swal({
        title: 'Empty File!',
        text: 'It looks like you uploaded an empty JSON file.',
        type: 'error',
        confirmButtonText: 'Close',
        timer: 2500,
      });
    } else if (check.type === 'fileValid') {
      const filesToBeIndexed = fileContents.files;
      this.indices[fileContents.name] = {
        fileLen: filesToBeIndexed.length,
      };
      filesToBeIndexed.forEach((doc, index) => {
        const splitTextAndTitle = `${doc.text} ${doc.title}`.split(' ');
        this.checkIndex(splitTextAndTitle, fileContents.name, index);
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
  getIndex(name) {
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
  searchFeedback(termsArray, file) {
    const searchResults = {};
    termsArray.forEach((term, index) => {
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
  searchIndex(currFile, ...searchTerm) {
    const searchResults = {};
    let termsArray = [];
    termsArray = this.sanitizeInput(searchTerm[0]);
    if (!currFile) {
      Object.keys(this.indices).forEach((fileName) => {
        searchResults[fileName] = this.searchFeedback(termsArray, this.indices[fileName]);
      });
    } else {
      try {
        const file = this.indices[currFile];
        searchResults[currFile] = this.searchFeedback(termsArray, file);
      } catch (e) {
        return null;
      }
    }
    return searchResults;
  }
}
window.Index = Index;
export default Index;
