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
 * method that creates object of indices and check
 * if word has been indexed before
 *
 * @param {array} words
 * @param {string} file
 * @param {object} source
 * @param {number} id
 */
  checkIndex(words, textWords, file, source, id) {
    words.forEach((word) => {
      const theword = this.sanitizeInput(word);
      if (!this.indices[file][theword]) {
        this.indices[file][theword] = {};
        this.indices[file][theword][id] = {
          source,
          file,
        };
      }
      this.indices[file][theword][id] = {
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
 * @param {object} fileContents
 * @returns {object} check
 */
  createIndex(fileContents) {
    const check = this.fileCheck(fileContents);
    if (check.type === 'fileEmpty') {
      alert('It looks like you uploaded an empty JSON file.');
    } else if (check.type === 'fileValid') {
      const filesToBeIndexed = fileContents.files;
      const size = [];
      this.indices[fileContents.name] = {
        fileLen: (() => {
          for (let i = 0; i < filesToBeIndexed.length; i += 1) {
            size.push(i);
          }
          return size;
        })(),
      };
      filesToBeIndexed.forEach((i) => {
        const doc = filesToBeIndexed[i];
        const splittedTitle = doc.title.split(' ');
        this.checkIndex(splittedTitle, fileContents.name, doc, i);
        const splittedText = doc.text.split(' ');
        this.checkIndex(splittedText, fileContents.name, doc, i);
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
 * @param {object} file
 * @returns {object} searchResults
 */
  searchFeedback(termsArray, file) {
    const searchResults = {};
    termsArray.forEach((term, index) => {
      if (file.hasOwnProperty(term)) {
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
 * @param {object} currentFile
 * @param {array} searchTerm
 * @returns {object} searchResults
 */
  searchIndex(currentFile, ...searchTerm) {
    const searchResults = {};
    let termsArray = [];
    if (typeof (searchTerm) === 'string') {
      termsArray = this.sanitizeInput(searchTerm);
    } else {
      termsArray = searchTerm;
    }
    if (!currentFile) {
      for (const i in this.indices) {
        searchResults[i] = this.searchFeedback(termsArray, this.indices[i]);
      }
    } else {
      try {
        const file = this.indices[currentFile];
        searchResults[file] = this.searchFeedback(termsArray, file);
      } catch (e) {
        return null;
      }
    }
    return searchResults;
  }
}
window.Index = Index;

export default Index;
