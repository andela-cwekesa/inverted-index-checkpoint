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
          $window.alert ('Unable to load the file.Please retry');
        } else {
          $window.alert('Please , strictly select a JSON file.');
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
      const x = JSON.stringify(fileContents);
      try {
        JSON.parse(x);
        const success = obj.createIndex(fileContents);
        if (success) {
          alert ('The operation was successful.');
          const result = obj.getIndex();
          const fileLength = result[fileContents.name].fileLen;
          $timeout(() => {
            $scope.container[fileContents.name] = {
              dataAfterIndexed: result[fileContents.name],
              fileSize: (() => {
                const size = [];
                for (let i = 0; i < fileLength.length; i += 1) {
                  size.push(i);
                }
                return size;
              })(),
            };
          }, 200);
        } else {
          alert('The operation was not successful.');
        }
      } catch (e)
    { alert('Invalid JSON file'); }
    };
  $scope.searchIndex = () => {
    const fName = $scope.selectedFile;
    const txtSearch = $scope.txtSearch;
    if (!txtSearch) {
      alert('You haven\'t provided anything to be searched.');
    }
    else if (Object.keys($scope.beforeIndex).length <= 0) {
      alert('Unable to find an indexed file');
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

