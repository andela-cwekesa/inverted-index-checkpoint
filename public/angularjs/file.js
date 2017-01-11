
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
                // Retrieve the first file from the FileList object
                let fileContents = fc.target.files[0];
                if (fileContents.name.indexOf('json') >= 0) {
                    file = fileContents.name;
                    // reading data in the file
                    let check = reader.readAsText(fileContents);
                    
                } else {
                    alert("Please , strictly select a JSON file.");
                }
                
                
            });
            
            reader.onload = () => {
                // control change the view value
                control.$setViewValue({
                    name: file,
                    files: scope.$eval(reader.result)
                });

                if (attr.fileLoaded) {
                    scope.$eval(attr.fileLoaded);
                }
            };
        }
    };
}]); 

app.controller('myController' ,  ($scope , $timeout) => {

    $scope.beforeIndex = {}; 
    $scope.container = {};
    let obj = new Index();
    
    $scope.loadFile =  () => {
        $timeout(function () {
            $scope.beforeIndex[$scope.file.name] = angular.copy($scope.file);
        } , 200); // loads file after 200 microseconds
    }

    $scope.createIndex = (fName) => {
        let fileContents = $scope.beforeIndex[fName];
        console.log(obj)
        let success = obj.createIndex(fileContents);
        
        if (success.status) {
            alert ('The operation was successful.');
            
            let result = obj.getIndex();
            let fileLength = result[fileContents.name].uploadedFile;

            $timeout(function () {
                $scope.container[fileContents.name] = {
                    dataAfterIndexed: result[fileContents.name],
                    length: (function () {
                        let emptyArray = [];
                        $scope.disp = emptyArray;
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
    }

    $scope.searchIndex = function () {
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

