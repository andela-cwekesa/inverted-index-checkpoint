 let Index = (function () {
    const that = this;
    let container = {};

    this.fileCheck=(fileContents) => {
    if (fileContents.files === undefined) {
        return message = {
            type: "Empty",
            status: false,
            message: fileContents.name + "is empty!"
        };
    }
    
    if (typeof fileContents === "object") {
        return message = {
            type: "Valid",
            status: true,
            message: fileContents.name + " has been indexed successfully."
        };
    }

    if (fileContents.files === "json") {
        return message = {
            type: "json" ,
            status : true,
            message : fileContents.name + "is not a json file!"
        };
    }
};

this.searchCheck = (searchQuery) => {
    if (typeof searchQuery === "string") {
        let splitted = searchQuery.split(' ');
        return {
            type: "string" ,
            wordsType: splitted
        }
    }
    else if(Array.isArray(searchQuery)) {
        let splitted = searchQuery;
        return {
            type: "array" ,
            wordsType: splitted
        }
    }
};

 // method that sanitizes  input
 this.sanitizeInput = (content)=> {
    let characters = content.trim().replace(/[^a-z0-9]+/gi, ' ').toLowerCase().split(' ');
    return characters;
  };
  // method that check as to whether word has been indexed
    this.checkIndex = (words , file , source , id ) => {
        words.forEach(function (word) {
            let newWord = that.sanitizeInput(word);
            // check if newWord has been indexed before
            if (container[file][newWord] === undefined) {
                
                container[file][newWord] = {};
                // fill container with data
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
    this.createIndex = (fileContents)=>{
        let check = this.fileCheck(fileContents);
        console.log(check)
        if(check.type === "Empty")
        {
            return check;

        }
        else if(check.type === "Bad Format")
        {
            return check;
        }
        else if (check.type === "Valid") {
                let docs = fileContents.files;
                let arr = [];
                container[fileContents.name] = {
                  uploadedFile: (function () {
                        for (let i = 0; i < docs.length; i++) {
                            arr.push(i);
                        }
                        return arr;
                    })()
                    
                }
/*let x = JSON.stringify(container);
console.log(x.toString());*/
/*let test = Object.entries(container);
console.log(container.toString());
Object.keys(container).forEach(function(key) {

    console.log(key, container[key]);

});
console.log(test);*/
for (let [key,value] in container){console.log(key);}
                for (let i = 0; i < docs.length; i++) {
                    let f = docs[i];
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
  
// search method
let testing =[
  {
    "title": "Alice in Wonderland",
    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
  },

  {
    "title": "alice The Lord of the Rings: The Fellowship of the Ring.",
    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
  }
]
    //}

    this.search = (termsArray ,fName) => {
        let searchResults = {};
        //fName = new Object();
        termsArray.forEach(function(i ,j){
            console.log(fName);
            if (fName.indexOf(i) != undefined){
                searchResults[termsArray[j]] = fName[i];
            }
            else {
                searchResults[termsArray[j]] = [];
            }
        });
        return searchResults;
    }

    this.searchIndex = (currFile , ...searchTerm) => {
        let searchResults = {};
        let termsArray = [];
        if (typeof(searchTerm) === 'string'){
            termsArray = this.sanitizeInput(searchTerm);
        }
        else{
            termsArray = searchTerm;
        }
        if (!currFile) {
            for (let i in container) {
                searchResults[i] = this.search(termsArray , container[i])
            }
        }
        else{
            let file =  container[currFile];
            searchResults[file] = this.search(termsArray , file);
        }
        return searchResults;
        console.log(searchResults)

    }
    
});
