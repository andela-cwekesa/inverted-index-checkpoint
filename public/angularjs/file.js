/*var app = angular.module('fileUpload', ['ngFileUpload']);
app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});

app.controller('fileController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '127.0.0.1',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
                    $scope.x = document.getElementById("myBtn");
                    $scope.x.disabled = false;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }
    }
}]) */

let app = angular.module("myApp", []);

app.directive("fileChange", ["$window",  ($window) => {
    return {
        // both Element(E) names and Attribute(A) names can invoke the directive
        restrict: "EA",
        require: "ngModel",
        link:  (scope, element, attr, control) => {
            // FileReader is used to read the contents of a file
            
            const reader = new FileReader;

            // declares name of the file
            //let file = 0;
            
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
                /*if(!fileContents)
                {
                    alert("Failed to load file");
                } 
                else if (!file.type.match('json')) 
                {
                    alert(fileContents.name + " is not a valid JSON file.");
                } 
                else 
                {
                    file = fileContents.name;
                    var readFileData = reader.readAsText(fileContents);
                }*/
                
                
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
    
    $scope.loadFile =  () => {
        $timeout(function () {
            $scope.beforeIndex[$scope.file.name] = angular.copy($scope.file);
        } , 200); // loads file after 200 microseconds
    }

    $scope.createIndex = (fName) => {
        
        let fileContents = $scope.beforeIndex[fName];
        let obj = new Index();
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
                        //console.log(emptyArray);
                    })()
                }
            }, 200);
        } else {
            alert('The operation was not successful.');
        }
        //for (let [key,value] in $scope.beforeIndex){console.log(value.name);}
    }

    $scope.searchIndex = function () {
        let obj = new Index();
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
                //doc:$scope.obj.container[i]
            }
        }

    }
});

