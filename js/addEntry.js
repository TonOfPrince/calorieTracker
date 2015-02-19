angular.module('calorieTrackerApp.addEntry', [])

.controller('AddEntryCtrl', function($scope, $http, AddEntry) {
  angular.extend($scope, AddEntry);
})

.factory('AddEntry', function($http) {
  var saveEntry = function(calories, comments, datetime) {
    $http.post('/saveEntry', {calories: calories, comments: comments, datetime: datetime})
      // data is the response i get back from the server
      .success(function(data, status, headers, config) {
        console.log('success');
        console.log(datetime)
        console.log(calories);
        console.log(comments);
      })
      .error(function(data, status, headers, config) {
        console.log('error');
      })
  }
  return {
    saveEntry: saveEntry
  }
})
