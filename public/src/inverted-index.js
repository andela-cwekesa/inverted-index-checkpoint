/**
* @class representing an Index
*/
class Index {
  /**
  * Constructor initializes indices to an empty object
  */
  constructor() {
    this.indices = {};
  }

  /**
  * @method fileCheck
  *
  * Checks if file is empty, valid or object
  *
  * @param {object} fileContents
  */
  fileCheck(fileContents) {
    if (!fileContents.files) {
      return this.message = {
        type: 'fileEmpty',
        message: `${fileContents.name} ${'is empty!'}`,
      };
    }
    if (typeof fileContents === 'object') {
      return this.message = {
        type: 'fileValid',
        message: `${fileContents.name} ${' has been indexed successfully.'}`,
      };
    }
    if (Object.keys(fileContents.files[0]).includes('text', 'title') && Object.keys(fileContents.files[1]).includes('text', 'title')){
        return this.message = {
          type: 'rightFile',
          message: `${fileContents.name} ${'is right.'}`,
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
  isJSON(fileData) {
    fileData = typeof fileData !== 'string' ? JSON.stringify(fileData) : fileData;
    try {
      JSON.parse(fileData);
      return true;
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
  sanitizeInput(content) {
    const characters = content.trim().replace(/[^a-z0-9 ]/gi, '').toLowerCase().split(' ');
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
  createIndex(fileName, fileContents) {
    const obj = {
      name: fileName,
      files: fileContents,
    };
    const check = this.fileCheck(obj);
    if (check.type === 'fileValid') {
      const filesToBeIndexed = fileContents;
      this.indices[fileName] = {
        filesToBeIndexed,
      };
      filesToBeIndexed.forEach((doc, index) => {
        const splitTextAndTitle = `${doc.text} ${doc.title}`.split(' ');
        splitTextAndTitle.forEach((word) => {
          const theword = this.sanitizeInput(word);
          if (!this.indices[fileName][theword]) {
            this.indices[fileName][theword] = new Set();
            this.indices[fileName][theword].add(index);
          }
          this.indices[fileName][theword].add(index);
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
  getIndex(name) { return name && typeof name === 'string' ? this.indices[name] : this.indices; }

  /**
  * @method doSearch
  *
  * Takes terms of array and fetch result of each token.
  *
  * @param {array} termsArray
  * @param {object} file
  * @returns {object} searchResults
  */
  doSearch(termsArray, fileIndex) {
    const searchResults = {};
    termsArray.forEach((term, index) => {
      if (fileIndex.hasOwnProperty(term)) {
        searchResults[termsArray[index]] = Array.from(fileIndex[term]);
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
  searchIndex(currentFile, ...searchTerm) {
    const searchResults = {};
    const termsArray = this.sanitizeInput(searchTerm[0]);
    if (!currentFile) {
      Object.keys(this.indices).forEach((fileName) => {
        searchResults[fileName] = this.doSearch(termsArray, this.indices[fileName]);
      });
    } else {
      try {
        const file = this.indices[currentFile];
        searchResults[currentFile] = this.doSearch(termsArray, file);
      } catch (e) {
        return null;
      }
    }
    return searchResults;
  }
}

window.Index = Index;
export default Index;
