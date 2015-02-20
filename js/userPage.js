angular.module('calorieTrackerApp.userPage', [])

.controller('UserPageCtrl', function($scope, $http, UserPage, $cookieStore) {
  angular.extend($scope, UserPage);
  console.log($cookieStore.get('user'));
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
  var saveEntry = function(calories, comments, date, time) {
    $http.post('/saveEntry', {calories: calories, comments: comments, date: date,  time: time, user: $cookieStore.get('user')})
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
    var filteredResults = [];
    entries.forEach(function(entry) {
      jsEntryDate = new Date(entry.date);
      if (jsEntryDate >= dateFrom && jsEntryDate <= dateTo) {
        filteredResults.push(entry);
      }
    })
    return filteredResults;
  }
})
.filter('timeFilter', function() {
  return function(entries, timeFrom, timeTo) {
    console.log('entires ' + entries)
    var filteredResults = [];
    entries.forEach(function(entry) {
      jsEntryTime = new Date(entry.time);
      if (jsEntryTime >= timeFrom.getTime() && jsEntryTime <= timeTo.getTime()) {
        filteredResults.push(entry);
      }
    })
    return filteredResults;
  }
})
