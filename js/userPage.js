angular.module('calorieTrackerApp.userPage', [])

.controller('UserPageCtrl', function($scope, $http, UserPage, $cookieStore, $q) {
  // extend factory to the controller
  angular.extend($scope, UserPage);
  // saves the user to the scope to be displayed
  // $scope.user = $cookieStore.get('user');
  $q(function(resolve, reject) {
    // $http.post('/calories', {id: $cookieStore.get('user')})
    $http.post('/calories', {token: sessionStorage.token})
      .success(function(data, status, headers, config) {
          console.log('success');
          $scope.userEntries = data.entries;
          $scope.user = data.user;
          resolve();
        })
        .error(function(data, status, headers, config) {
          console.log('error');
          reject()
        });
  }).then(function() {
    $q(function(resolve,reject) {
      // grabs all the logged in user entries.
      // $http.post('/expectedCalories', {id: $cookieStore.get('user')})
      $http.post('/expectedCalories', {token: sessionStorage.token})
        .success(function(data, status, headers, config) {
            console.log('success');
            $scope.expectedCalories = data.expectedCalories;
            console.log($scope.expectedCalories);
            resolve();
          })
          .error(function(data, status, headers, config) {
            console.log('error');
            reject();
          });
    }).then(function() {
      $q(function(resolve, reject) {
        // saves the sum of the users daily calories to scope
        $scope.dailyCalories = $scope.sumCalories($scope.userEntries).$$state.value;
        resolve();
      }).then(function() {
        console.log($scope.dailyCalories);
        console.log($scope.expectedCalories);
        if ($scope.dailyCalories < $scope.expectedCalories) {
          $('#dailyCalories').addClass('under');
        } else {
          $('#dailyCalories').addClass('over');
        }
      });
    });
  });
})

.factory('UserPage', function($http, $cookieStore, $q) {
  // saves an entry to the database
  var saveEntry = function(calories, comments, date, time) {
    // makes a post request to the server to save the entry
    $http.post('/saveEntry', {calories: calories, comments: comments, date: date,  time: time, token: sessionStorage.token})
      // data is the response i get back from the server
      .success(function(data, status, headers, config) {
        console.log('success');
      })
      .error(function(data, status, headers, config) {
        console.log('error');
      })
  }
  // adds up daily calories from a group of entries
  var sumCalories = function(entries) {
    console.log(entries);
    var result = 0;
    // setting up variable for current date
    var currentDateTime = new Date();
    var currentDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate())
    // returns the calorie sum in a promise
    return $q(function(resolve, reject) {
      // look through all entries
      entries.forEach(function(entry) {
        jsEntryDate = new Date(entry.date);
        // check to see if entry was from today
        if (jsEntryDate.valueOf() === currentDate.valueOf()) {
          // add entry's calories to sum if entry was from today
          result += entry.calories;
        }
      });
      resolve(result);
    });
  }

  var deleteEntry = function(entry) {
    console.log(entry);
    $http.post("/deleteEntry", entry);
  }

  return {
    saveEntry: saveEntry,
    sumCalories: sumCalories,
    deleteEntry: deleteEntry
  }
})
// filter on a from and to date
.filter('dateFilter', function() {
  return function(entries, dateFrom, dateTo, isChecked) {
    if (isChecked) {
      var filteredResults = [];
      entries.forEach(function(entry) {
        jsEntryDate = new Date(entry.date);
        if (jsEntryDate >= dateFrom && jsEntryDate <= dateTo) {
          filteredResults.push(entry);
        }
      })
      return filteredResults;
    } else {
      return entries;
    }
  }
})
// filter on a from and to time
.filter('timeFilter', function() {
  return function(entries, timeFrom, timeTo, isChecked) {
    // console.log(isChecked)
    if (isChecked) {
      console.log('entires ' + entries)
      var filteredResults = [];
      entries.forEach(function(entry) {
        jsEntryTime = new Date(entry.time);
        if (jsEntryTime >= timeFrom.getTime() && jsEntryTime <= timeTo.getTime()) {
          filteredResults.push(entry);
        }
      })
      return filteredResults;
    } else {
      return entries;
    }
  }
})
