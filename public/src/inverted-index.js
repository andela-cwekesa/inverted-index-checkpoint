let Index = (function () {
    const container = {};
    this.fileCheck=(fileContents) => {
    if (fileContents.files === undefined) {
        return message = {
            type: "fileEmpty",
            status: false,
            message: fileContents.name + "is empty!"
        };
    }
    if (typeof fileContents === "object") {
        return message = {
            type: "fileValid",
            status: true,
            message: fileContents.name + " has been indexed successfully."
        };
    }
    let x = stringify(fileContents);                                                                                                                                                                                                           
    if ((JSON.parse(x)) === false) {
                return message = {
                    type: "invalidFormat",
                    status: false,
                    message: fileContents.name + "Invalid format."
                }
            }
    }; 
     // method that sanitizes  input
    this.sanitizeInput = (content)=> {
    let characters = content.trim().replace(/[.[,\]/#!$%\^&\*;:@{}=\-_`~()]/g, '').toLowerCase().split(' ');
    return characters;
    };
  // method that check as to whether word has been indexed
    this.checkIndex = (words , file , source , id ) => {
        words.forEach( (word) => {
            let newWord = this.sanitizeInput(word);
            if (container[file][newWord] === undefined) {    
                container[file][newWord] = {};   
                container[file][newWord][id] = {
                    source: source,
                    file:file
                };
            } 
            container[file][newWord][id] = {
                source: source,
                file: file
            };
        });
    }
    // method that creates indices
    this.createIndex = (fileContents)=> {
        let check = this.fileCheck(fileContents);
        if(check.type === "fileEmpty")
        {  
          alert('It looks like you uploaded an empty JSON file.');
        }
        else if(check.type === "invalidFormat")
        {
         alert('It looks like the file is in bad format.');
        }
        else if (check.type === "fileValid") {
                let indFiles = fileContents.files;
                let arr = [];
                container[fileContents.name] = {
                  uploadedFile: ( () => {
                        for (let i = 0; i < indFiles.length; i++) {
                            arr.push(i);
                        }
                        return arr;
                    })()    
                }
                for (let i = 0; i < indFiles.length; i++) {
                    let f = indFiles[i];
                    // split title into an array
                    let splittedTitle = f.title.split(" ");
                    this.checkIndex(splittedTitle, fileContents.name, f, i);
                    // split the text into an array then index it.
                    let splittedText = f.text.split(" ");
                    this.checkIndex(splittedText, fileContents.name, f, i); 
                }     
                return check;
        }      
    }
// method that return index
     this.getIndex = (fName) => {
        if (fName && typeof fName === "string") {
            return container[fName];
        } else {
            return container;
        }
    }  
    // search methods
    this.searchFeedback = (termsArray ,fName) => {
        const searchResults = {};
        termsArray.forEach((i ,j) =>{
            if (fName.hasOwnProperty(i)){
                searchResults[termsArray[j]] = fName[i];
            }
            else {    
             alert('Sorry , but nothing matched your search.');
            }
        });
        return searchResults;
    }
    this.searchIndex = (currFile , ...searchTerm) => {
        const searchResults = {};
        let termsArray = [];
        if (typeof(searchTerm) === 'string'){
            termsArray = this.sanitizeInput(searchTerm);
        }
        else{
            termsArray = searchTerm;
        }
        if (!currFile) {
            for (let i in container) {
                searchResults[i] = this.searchFeedback(termsArray , container[i]);
            }
        }
        else{ 
            try{   
            let file =  container[currFile];
            searchResults[file] = this.searchFeedback(termsArray , file);
        }
        catch(e){  
               return null;      
            }
        }
        return searchResults;
    }    
});
