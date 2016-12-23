var Index = (function () {
    var container = {};

    this.fileCheck=function(fileContents) {
    if (fileContents.files === undefined) {
        return message = {
            type: "Empty",
            status: false,
            message: fileContents.name + " file is empty"
        };
    }

    if (fileContents.files[0].title === undefined && fileContents.files[0].text === undefined) {
        return message = {
            type: "Bad Format",
            status: false,
            message: fileContents.name + " file is not in the correct format"
        };
    }

    if (typeof fileData === "object") {
        return message = {
            type: "Valid",
            status: true,
            message: "The file " + fileContents.name + " has been indexed"
        };
    }
};


    this.createIndex=function(fileContents)
    {
        var check = this.fileCheck(fileContents);
        if(check.type === "Empty")
        {
            return check;
        }
        else if(check.type === "Bad Format")
        {
            return check;
        }
        else if (fileCheck.type === "Valid") {
                var files = fileContents.file;
                var arr = [];
                container[fileContents.name] = {
                  filez: (function () {
                        for (var i = 0; i < files.length; i++) {
                            arr.push(i);
                        }
                        return arr;
                    })
                    
                }

                for (var i = 0; i < files.length; i++) {
                    var f = files[i];
                    // split title into an array
                    var splittedTitle = f.title.split(" ");


                }
                return check;
            }
    }

    this.searchIndex = function(){
        //
    }
});
