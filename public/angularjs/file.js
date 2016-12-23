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

var app = angular.module("myApp", []);

myapp.directive("myDirective", ["$window", function ($window) {
    return {
        // both Element(E) names and Attribute(A) names can invoke the directive(which is myDirective)
        restrict: "EA",
        require: "ngModel",
        link: function (scope, element, attr, control) {
            // FileReader is used to read the contents of a file
            // create constructor
            var reader = new FileReader();

            // declares name of the file
            var file = 0;
            
            // get access to element that triggered an event
            element.bind("change", function (fc) {
                // Retrieve the first file from the FileList object
                var fileContents = fc.target.files[0];
                if(!fileContents)
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
                }
                
            });
            // fires immediately when an object has been loaded
            reader.onload = function () {
                // control change the view value
                control.$setViewValue({
                    name: file,
                    files: scope.$eval(fileReader.result)
                });

                if (attrs.fileLoaded) {
                    scope.$eval(attr.fileLoaded);
                }
            };
        }
    };
}]);
