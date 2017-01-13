
let app = angular.module("myApp", []);
app.directive("fileChange", ["$window",  ($window) => {
    return {
        // both Element(E) names and Attribute(A) names can invoke the directive
        restrict: "EA",
        require: "ngModel",
        link:  (scope, element, attr, control) => {
            // FileReader is used to read the contents of a file 
            const reader = new FileReader;
            // get access to element that triggered an event
            element.bind("change",  (fc) => {    
                let fileContents = fc.target.files[0];  // Retrieves the first File from the FileList object (w3c file api)
                if (fileContents.name.indexOf('json') >= 0) {
                    file = fileContents.name;
                // reading data in the file    
                let check = reader.readAsText(fileContents);
                } 
                else if (!fileContents){
                    $window.alert ("Unable to load the file.Please retry");
                }
                else {
                    $window.alert("Please , strictly select a JSON file.");
                }              
            });
                reader.onload = () => {
                // control change /update the view value
                control.$setViewValue({
                    name: file,
                    files: scope.$eval(reader.result)
                });
                if (attr.selectedFile) {
                    scope.$eval(attr.selectedFile);
                }
            };                    
        }
    };
}]); 
app.controller('myController' ,  ($scope , $timeout) => {
    $scope.beforeIndex = {}; 
    $scope.container = {};
    const obj = new Index();   
    $scope.loadFile =  () => {
        $timeout( () => {
            $scope.beforeIndex[$scope.file.name] = angular.copy($scope.file);
        } , 200); // loads file after 200 microseconds
    }
    $scope.createIndex = (fName) => {
        let fileContents = $scope.beforeIndex[fName];
        let x = JSON.stringify(fileContents)
        try{
        JSON.parse(x)
        let success = obj.createIndex(fileContents);   
        if (success) {
            alert ('The operation was successful.');    
            let result = obj.getIndex();
            let fileLength = result[fileContents.name].uploadedFile;
            $timeout( () => {
                $scope.container[fileContents.name] = {
                    dataAfterIndexed: result[fileContents.name],
                    length: ( () => {
                        let emptyArray = [];
                        for (let x = 0; x < fileLength.length; x++) {
                            emptyArray.push(x);
                        }
                        return emptyArray;
                    })()
                }
            }, 200);
        } else {
            alert('The operation was not successful.');
        }
    }catch(e){alert('Invalid JSON file');}
    }
    $scope.searchIndex =  () => {
        let fName = $scope.selectedFile;
        let txtSearch = $scope.txtSearch;
        if (!txtSearch) {
            alert('You haven\'t provided anything to be searched.');
        }
        else if (Object.keys($scope.beforeIndex).length <= 0) {
            alert('Unable to find an indexed file')
        }
        else{
            $scope.searchResults = obj.searchIndex(fName , txtSearch)
        }
        for(let i in $scope.searchResults){
            $scope.beforeIndex[i] = {
                name:i,
                index:$scope.searchResults[i],
            }
        }
    }
});

