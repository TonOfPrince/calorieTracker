angular.module('calorieTrackerApp.addEntry', [])

.controller('AddEntryCtrl', function($scope, $http, AddEntry, $cookieStore) {
  angular.extend($scope, AddEntry);
  console.log($cookieStore.get('user'));

})

.factory('AddEntry', function($http, $cookieStore) {
  var saveEntry = function(calories, comments, datetime) {
    $http.post('/saveEntry', {calories: calories, comments: comments, datetime: datetime.toString(), user: $cookieStore.get('user')})
      // data is the response i get back from the server
      .success(function(data, status, headers, config) {
        console.log('success');
        console.log(datetime)
        console.log(calories);
        console.log(comments);
        console.log($cookieStore.get('user'));
      })
      .error(function(data, status, headers, config) {
        console.log('error');
      })
  }
  return {
    saveEntry: saveEntry
  }
})
