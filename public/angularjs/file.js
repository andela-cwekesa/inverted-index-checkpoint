const app = angular.module('myApp', []);

app.directive('fileChange', ['$window', ($window) => {
  return {
// both Element(E) names and Attribute(A) names can invoke the directive
    restrict: 'EA',
    require: 'ngModel',
    link: (scope, element, attr, control) => {
// FileReader is used to read the contents of a file
      const reader = new FileReader();
// get access to element that triggered an event
      element.bind('change', (fc) => {
        const fileContents = fc.target.files[0];  // Retrieves the first File from the FileList object (w3c file api)
        if (fileContents.name.indexOf('json') >= 0) {
          file = fileContents.name;
          type = fileContents.type;
          size = fileContents.size;
// reading data in the file
          const read = reader.readAsText(fileContents);
        } else if (!fileContents) {
          swal({
            title: 'Unsuccessful.',
            text: 'Unable to load the file.Please retry',
            type: 'error',
            confirmButtonText: 'Close',
            timer: 2000,
          });
        } else {
          swal({
            title: 'Invalid JSON File.',
            text: 'Please , strictly select a JSON file.',
            type: 'error',
            confirmButtonText: 'Close',
            timer: 2500,
          });
          
        }           
      });
      reader.onload = () => {
// control change /update the view value
        control.$setViewValue({
          name: file,
          files: scope.$eval(reader.result),
          type: type,
          size: size,
        });      
        if (attr.selectedFile) {
          scope.$eval(attr.selectedFile);
        }
        };  
    },
  };
}]);

app.controller('myController', ($scope, $timeout) => {
  $scope.beforeIndex = {}; 
  $scope.container = {};
  const obj = new Index();   
  $scope.loadFile =  () => {
    $timeout(() => {
            $scope.beforeIndex[$scope.file.name] = angular.copy($scope.file);
        } , 200); // loads file after 200 microseconds
    };
    $scope.createIndex = (fName) => {
      const fileContents = $scope.beforeIndex[fName];
      const stringified = JSON.stringify(fileContents);
      try {
        JSON.parse(stringified);
        const success = obj.createIndex(fileContents.name, fileContents.files);
        if (success) {
          swal({
            title: 'Success!',
            text: 'The index was created successfully.',
            type: 'success',
            confirmButtonText: 'Close',
            timer: 2000,
          });
          const result = obj.getIndex();
          const fileLength = result[fileContents.name].fileLen;
          delete result[fileContents.name].fileLen;
          $timeout(() => {
            $scope.container[fileContents.name] = {
              dataAfterIndexed: result[fileContents.name],
              fileSize: (() => {
                return Array.from({ length: fileLength }, (value, index) => index);
              })(),
            };
          }, 200);
        } else {
          swal({
            title: 'Unsuccessful.',
            text: 'Unsuccessful.Please check the file',
            type: 'warning',
            confirmButtonText: 'Close',
            timer: 2000,
          });
        }
      } catch (e) {
        swal({
            title: 'Error!',
            text: 'The operation was not successful.',
            type: 'error',
            confirmButtonText: 'Close',
            timer: 2000,
          });
      }
    };
  $scope.searchIndex = () => {
    const fName = $scope.selectedFile;
    const txtSearch = $scope.txtSearch;
    if (!txtSearch) {
      swal({
        title: 'No search item.',
        text: 'You haven\'t provided anything to be searched.',
        type: 'warning',
        confirmButtonText: 'Close',
        timer: 2000,
      });
    }
    else if (Object.keys($scope.beforeIndex).length <= 0) {
      swal({
        title: 'Not Found!',
        text: 'Unable to find an indexed file.',
        type: 'warning',
        confirmButtonText: 'Close',
        timer: 2000,
      });
    }
    else {
      $scope.searchResults = obj.searchIndex(fName, txtSearch);
    }
    for(let i in $scope.searchResults) {
      $scope.beforeIndex[i] = {
        name: i,
        index: $scope.searchResults[i],
      };
    }
  };
});

