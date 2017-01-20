/** @class representing an Index. */
module.exports = class Index {
  /**
     * Constructor initializes container to an empty object.
     */
  constructor() {
    this.container = {};
  }
  /**
   * @method checks file
   * @param {string} fileContents
   */
  fileCheck(fileContents) {
    if (!fileContents.files) {
      return this.message = {
        type: "fileEmpty",
        status: false,
        message: fileContents.name + "is empty!"
      };
    }
    if (typeof fileContents === "object") {
      return this.message = {
        type: "fileValid",
        status: true,
        message: fileContents.name + " has been indexed successfully."
      };
    }
    let x = stringify(fileContents);                                                                                                                                                                                                           
    if ((JSON.parse(x)) === false) {
      return this.message = {
        type: "invalidFormat",
        status: false,
        message: fileContents.name + "Invalid format."
      };
    }
  } 
  
/**
 * sanitizes input
 * 
 * @method sanitizeInput
 * @param {string} content
 * @return {string} return characters
 */
  sanitizeInput (content) {
    let characters = content.trim().replace(/[.[,\]/#!$%\^&\*;:@{}=\-_`~()]/g, '').toLowerCase().split(' ');
    return characters;
  }
  /**
   * method that creates object of indices and check 
   * if word has been indexed before
   * @param {array} words
   * @param {string} file
   * @param {object} source
   * @param {number} id
   */
  
  checkIndex (words , file , source , id ) {
    words.forEach( (word) => {
      let theword = this.sanitizeInput(word);
      if (!this.container[file][theword]) {    
        this.container[file][theword] = {};   
        this.container[file][theword][id] = {
          source: source,
          file:file
        };
      } 
      this.container[file][theword][id] = {
        source: source,
        file: file
      };
    });
  }
    /**
     * method that creates indices
     * @param{json} fileContents
     */

  createIndex(fileContents) {
    let check = this.fileCheck(fileContents);
    if(check.type === "fileEmpty") {  
      alert("It looks like you uploaded an empty JSON file.");
    }
    else if(check.type === "invalidFormat") {
      alert("It looks like the file is in bad format.");
    }
    else if (check.type === "fileValid") {
      let indFiles = fileContents.files;
      let arr = [];
      this.container[fileContents.name] = {
        uploadedFile: ( () => {
          for (let i = 0; i < indFiles.length; i++) {
            arr.push(i);
          }
          return arr;
        })()
      };
      for (let i = 0; i < indFiles.length; i++) {
        let doc = indFiles[i];
        let splittedTitle = doc.title.split(" ");
        this.checkIndex(splittedTitle, fileContents.name, doc, i);
        let splittedText = doc.text.split(" ");
        this.checkIndex(splittedText, fileContents.name, doc, i); 
      }     
      return check;
    }      
  }

/**
 * method return index of files in container object
 * 
 * @param{string} name
 */
  getIndex (name) {
    if (name && typeof name === "string") {
      return this.container[name];
    } else {
      return this.container;
    }
  }  

    /**
     * takes terms of array and fetch result of each token.
     * 
     * @param{array} termsArray
     * @param{object} name
     * @param{object} searchResults 
     * 
     */
  searchFeedback (termsArray ,name) {
    const searchResults = {};
    termsArray.forEach((i ,j) =>{
      if (name.hasOwnProperty(i)){
        searchResults[termsArray[j]] = name[i];
      }
      else {    
        alert("Sorry , but nothing matched your search.");
      }
    });
    return searchResults;
  }

  /**
   * looks for search term in file return indices
   * 
   */
  searchIndex (currFile ,...searchTerm) {
    const searchResults = {};
    let termsArray = [];
    if (typeof(searchTerm) === "string") {
      termsArray = this.sanitizeInput(searchTerm);
    }
    else {
      termsArray = searchTerm;
    }
    if (!currFile) {
      for (let i in this.container) {
        searchResults[i] = this.searchFeedback(termsArray , this.container[i]);
      }
    }
    else { 
      try {   
        let file =  this.container[currFile];
        searchResults[file] = this.searchFeedback(termsArray , file);
      }
      catch(e) {  
        return null;      
      }
    }
    return searchResults;
  }    
};
