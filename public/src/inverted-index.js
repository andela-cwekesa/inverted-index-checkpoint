module.exports = class Index {
  constructor(){
    this.container = {};
  }
  fileCheck(fileContents) {
    if (fileContents.files === undefined) {
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
     // method that sanitizes  input
  sanitizeInput (content) {
    let characters = content.trim().replace(/[.[,\]/#!$%\^&\*;:@{}=\-_`~()]/g, '').toLowerCase().split(' ');
    return characters;
  }
  // method that check as to whether word has been indexed
  checkIndex (words , file , source , id ) {
    words.forEach( (word) => {
      let the = this.sanitizeInput(word);
      if (this.container[file][the] === undefined) {    
        this.container[file][the] = {};   
        this.container[file][the][id] = {
          source: source,
          file:file
        };
      } 
      this.container[file][the][id] = {
        source: source,
        file: file
      };
    });
  }
    // method that creates indices
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
        let f = indFiles[i];
        let splittedTitle = f.title.split(" ");
        this.checkIndex(splittedTitle, fileContents.name, f, i);
        let splittedText = f.text.split(" ");
        this.checkIndex(splittedText, fileContents.name, f, i); 
      }     
      return check;
    }      
  }
// method that return index
  getIndex (name) {
    if (name && typeof name === "string") {
      return this.container[name];
    } else {
      return this.container;
    }
  }  
    // search methods
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
