angular.module('calorieTrackerApp.userPage', [])

.controller('UserPageCtrl', function($scope, $http, UserPage, $cookieStore) {
  angular.extend($scope, UserPage);
  console.log($cookieStore.get('user'));
  // $scope.calories = $http.post('/calories', {id: $cookieStore.get('user')});
  $http.post('/calories', {id: $cookieStore.get('user')})
    .success(function(data, status, headers, config) {
        console.log('success');
        $scope.userEntries = data.entries;

        console.log(data)
      })
      .error(function(data, status, headers, config) {
        console.log('error');
      })
})

.factory('UserPage', function($http, $cookieStore) {
  var saveEntry = function(calories, comments, datetime) {
    $http.post('/saveEntry', {calories: calories, comments: comments, datetime: datetime, user: $cookieStore.get('user')})
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
.filter('dateFilter', function() {
  return function(entries, dateFrom, dateTo) {
    console.log('entires ' + entries)
    var filteredResults = [];
    entries.forEach(function(entry) {
      console.log('entry date ' + entry.date)
      console.log('date From ' + dateFrom)
      console.log('date To ' + dateTo)
      console.log(dateTo >= dateFrom)
      console.log(entry.date >= dateFrom)
      console.log(entry.date <= dateTo)

      if (entry.date >= dateFrom && entry.date <= dateTo) {
        filteredResults.push(entry);
      }
    })
    return filteredResults;
  }
});
// .filter('timeFilter')
